using Microsoft.EntityFrameworkCore;
using System.Threading.Channels;
using VstepPractice.API.Common.Enums;
using VstepPractice.API.Models.Entities;
using VstepPractice.API.Repositories.Interfaces;

namespace VstepPractice.API.Services.BackgroundServices;

public class AttemptStatusCheckingBackgroundService : BackgroundService, IAttemptStatusQueue
{
    private readonly Channel<int> _channel;
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ILogger<AttemptStatusCheckingBackgroundService> _logger;
    private readonly TimeSpan _timeout = TimeSpan.FromMinutes(5);
    private readonly TimeSpan _checkInterval = TimeSpan.FromSeconds(30);

    public AttemptStatusCheckingBackgroundService(
        IServiceScopeFactory scopeFactory,
        ILogger<AttemptStatusCheckingBackgroundService> logger)
    {
        _scopeFactory = scopeFactory;
        _logger = logger;
        _channel = Channel.CreateUnbounded<int>();
    }

    public async Task QueueStatusCheckAsync(int attemptId)
    {
        await _channel.Writer.WriteAsync(attemptId);
        _logger.LogInformation("Queued status check for attempt {AttemptId}", attemptId);
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                // Wait for new attempt to check
                var attemptId = await _channel.Reader.ReadAsync(stoppingToken);
                await ProcessAttemptStatus(attemptId, stoppingToken);
            }
            catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested)
            {
                break;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing status check");
            }
        }
    }

    private async Task ProcessAttemptStatus(int attemptId, CancellationToken cancellationToken)
    {
        using var scope = _scopeFactory.CreateScope();
        var unitOfWork = scope.ServiceProvider.GetRequiredService<IUnitOfWork>();

        try
        {
            var attempt = await unitOfWork.StudentAttemptRepository
                .GetAttemptWithDetailsAsync(attemptId, cancellationToken);

            if (attempt == null || !attempt.EndTime.HasValue)
                return;

            // Check timeout
            if (DateTime.UtcNow - attempt.EndTime.Value > _timeout)
            {
                attempt.Status = AttemptStatus.AssessmentCompleted;
                unitOfWork.StudentAttemptRepository.Update(attempt);
                await unitOfWork.SaveChangesAsync(cancellationToken);
                return;
            }

            // Check assessment status
            var allAssessed = await CheckAssessments(attempt, unitOfWork, cancellationToken);

            if (allAssessed)
            {
                attempt.Status = AttemptStatus.AssessmentCompleted;
                unitOfWork.StudentAttemptRepository.Update(attempt);
                await unitOfWork.SaveChangesAsync(cancellationToken);

                _logger.LogInformation(
                    "Attempt {AttemptId} assessment completed",
                    attemptId);
            }
            else
            {
                // Re-queue for later check if not complete
                await Task.Delay(_checkInterval, cancellationToken);
                await QueueStatusCheckAsync(attemptId);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex,
                "Error checking status for attempt {AttemptId}",
                attemptId);
            // Re-queue on error
            await QueueStatusCheckAsync(attemptId);
        }
    }

    private async Task<bool> CheckAssessments(
    StudentAttempt attempt,
    IUnitOfWork unitOfWork,
    CancellationToken cancellationToken)
    {
        var aiAnswers = attempt.Answers
            .Where(a => a.Question.Passage.SectionType is SectionTypes.Writing or SectionTypes.Speaking)
            .ToList();

        if (!aiAnswers.Any())
        {
            return true;
        }

        foreach (var answer in aiAnswers)
        {
            bool isAssessed = false;
            if (answer.Question.Passage.SectionType == SectionTypes.Writing)
            {
                var assessment = await unitOfWork.WritingAssessmentRepository
                    .GetByAnswerIdAsync(answer.Id, cancellationToken);
                isAssessed = assessment != null;
            }
            else if (answer.Question.Passage.SectionType == SectionTypes.Speaking)
            {
                var assessment = await unitOfWork.SpeakingAssessmentRepository
                    .GetByAnswerIdAsync(answer.Id, cancellationToken);
                isAssessed = assessment != null;
            }

            if (!isAssessed)
            {
                return false;
            }
        }

        return true;
    }
}
