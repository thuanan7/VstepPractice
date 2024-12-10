using System.Threading.Channels;
using VstepPractice.API.Models.DTOs.AI;
using VstepPractice.API.Models.Entities;
using VstepPractice.API.Repositories.Interfaces;
using VstepPractice.API.Services.AI;
using VstepPractice.API.Services.Speech;

namespace VstepPractice.API.Services.BackgroundServices;

public class SpeakingAssessmentBackgroundService : BackgroundService, ISpeakingAssessmentQueue
{
    private readonly Channel<SpeakingAssessmentTask> _taskChannel;
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ILogger<SpeakingAssessmentBackgroundService> _logger;

    public SpeakingAssessmentBackgroundService(
        IServiceScopeFactory scopeFactory,
        ILogger<SpeakingAssessmentBackgroundService> logger)
    {
        _scopeFactory = scopeFactory;
        _logger = logger;
        _taskChannel = Channel.CreateUnbounded<SpeakingAssessmentTask>();
    }

    public async Task QueueAssessmentTaskAsync(SpeakingAssessmentTask task)
    {
        await _taskChannel.Writer.WriteAsync(task);
        _logger.LogInformation(
            "Queued speaking assessment task for answerId {AnswerId}",
            task.AnswerId);
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                var task = await _taskChannel.Reader.ReadAsync(stoppingToken);
                await ProcessSpeakingAssessmentAsync(task, stoppingToken);
            }
            catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested)
            {
                break;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing speaking assessment");
            }
        }
    }

    private async Task ProcessSpeakingAssessmentAsync(
        SpeakingAssessmentTask task,
        CancellationToken cancellationToken)
    {
        using var scope = _scopeFactory.CreateScope();
        var hybridScoringService = scope.ServiceProvider.GetRequiredService<ISpeakingAssessmentService>();
        var unitOfWork = scope.ServiceProvider.GetRequiredService<IUnitOfWork>();

        try
        {
            await unitOfWork.BeginTransactionAsync(cancellationToken);

            // 1. Get answer with details
            var answer = await unitOfWork.AnswerRepository
                .GetAnswerWithDetailsAsync(task.AnswerId, cancellationToken);

            if (answer == null)
            {
                _logger.LogError("Answer not found for answerId {AnswerId}", task.AnswerId);
                return;
            }

            // 2. Get hybrid assessment (combines Azure + OpenAI)
            var assessmentResult = await hybridScoringService.AssessSpeakingAsync(
                task,
                cancellationToken);

            if (!assessmentResult.IsSuccess)
            {
                _logger.LogError(
                    "Failed to get assessment for answerId {AnswerId}: {Error}",
                    task.AnswerId,
                    assessmentResult.Error.Message);
                return;
            }

            var assessment = assessmentResult.Value;

            // 3. Create speaking assessment entity
            var speakingAssessment = new SpeakingAssessment
            {
                AnswerId = task.AnswerId,
                // Azure Scores
                Pronunciation = assessment.PronScore,
                Fluency = assessment.FluencyScore,
                AccuracyScore = assessment.AccuracyScore,
                ProsodyScore = assessment.ProsodyScore,
                // OpenAI Scores
                Vocabulary = assessment.VocabularyScore,
                Grammar = assessment.GrammarScore,
                TopicScore = assessment.TopicScore,
                // Content
                DetailedFeedback = assessment.DetailedFeedback,
                TranscribedText = assessment.RecognizedText,
                DetailedResultUrl = assessment.DetailedResultUrl,
                AudioUrl = task.AudioUrl,
                AssessedAt = DateTime.UtcNow
            };

            // 4. Update answer score and feedback
            answer.Score = speakingAssessment.TotalScore;
            answer.AiFeedback = assessment.DetailedFeedback;

            // 5. Save changes
            unitOfWork.AnswerRepository.Update(answer);
            unitOfWork.SpeakingAssessmentRepository.Add(speakingAssessment);

            await unitOfWork.SaveChangesAsync(cancellationToken);
            await unitOfWork.CommitAsync(cancellationToken);

            _logger.LogInformation(
                "Successfully processed speaking assessment for answerId {AnswerId}. " +
                "Scores - Pronunciation: {PronScore}, Fluency: {FluencyScore}, " +
                "Vocabulary: {VocabScore}, Grammar: {GrammarScore}",
                task.AnswerId,
                assessment.PronScore,
                assessment.FluencyScore,
                assessment.VocabularyScore,
                assessment.GrammarScore);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex,
                "Error processing speaking assessment for answerId {AnswerId}",
                task.AnswerId);
            await unitOfWork.RollbackAsync(cancellationToken);
            throw;
        }
    }
}