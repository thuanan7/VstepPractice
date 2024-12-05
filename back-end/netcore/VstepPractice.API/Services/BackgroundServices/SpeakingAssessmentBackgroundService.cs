using System.Threading.Channels;
using VstepPractice.API.Models.DTOs.AI;
using VstepPractice.API.Models.Entities;
using VstepPractice.API.Repositories.Interfaces;
using VstepPractice.API.Services.AI;
using VstepPractice.API.Services.Speech;
using VstepPractice.API.Services.Storage;

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
        var speechService = scope.ServiceProvider.GetRequiredService<ISpeechToTextService>();
        var storageService = scope.ServiceProvider.GetRequiredService<IFileStorageService>();
        var aiService = scope.ServiceProvider.GetRequiredService<IAiScoringService>();
        var unitOfWork = scope.ServiceProvider.GetRequiredService<IUnitOfWork>();

        var transcriptionService = scope.ServiceProvider
        .GetRequiredService<IAudioTranscriptionService>();
        

        try
        {
            await unitOfWork.BeginTransactionAsync(cancellationToken);

            // 1. Get answer
            var answer = await unitOfWork.AnswerRepository
                .GetAnswerWithDetailsAsync(task.AnswerId, cancellationToken);

            if (answer == null)
            {
                _logger.LogError("Answer not found for answerId {AnswerId}", task.AnswerId);
                return;
            }

            // 2. Download and transcribe audio
            using var audioStream = await storageService
        .DownloadFileAsync(task.AudioUrl);

            // Transcribe using Whisper
            var transcribedText = await transcriptionService
                .TranscribeAudioAsync(audioStream, cancellationToken);

            // 3. Get AI assessment
            var assessmentResult = await aiService.AssessSpeakingAsync(new SpeakingAssessmentTask
            {
                AnswerId = task.AnswerId,
                AudioUrl = task.AudioUrl,
                PassageTitle = answer.Question.Section.Title,
                PassageContent = answer.Question.Section.Content ?? string.Empty,
                QuestionText = answer.Question.QuestionText ?? string.Empty,
                TranscribedText = transcribedText
            }, cancellationToken);

            if (!assessmentResult.IsSuccess)
            {
                _logger.LogError(
                    "Failed to get AI assessment for answerId {AnswerId}: {Error}",
                    task.AnswerId,
                    assessmentResult.Error.Message);
                return;
            }

            var assessment = assessmentResult.Value;

            // 4. Create SpeakingAssessment
            var speakingAssessment = new SpeakingAssessment
            {
                AnswerId = task.AnswerId,
                Pronunciation = assessment.Pronunciation,
                Fluency = assessment.Fluency,
                Vocabulary = assessment.Vocabulary,
                Grammar = assessment.Grammar,
                DetailedFeedback = assessment.DetailedFeedback,
                TranscribedText = transcribedText,
                AudioUrl = task.AudioUrl,
                AssessedAt = DateTime.UtcNow
            };

            // 5. Update Answer score and feedback
            answer.Score = assessment.TotalScore;
            answer.AiFeedback = assessment.DetailedFeedback;

            unitOfWork.AnswerRepository.Update(answer);
            unitOfWork.SpeakingAssessmentRepository.Add(speakingAssessment);

            await unitOfWork.SaveChangesAsync(cancellationToken);
            await unitOfWork.CommitAsync(cancellationToken);

            _logger.LogInformation(
                "Successfully processed speaking assessment for answerId {AnswerId}",
                task.AnswerId);
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
