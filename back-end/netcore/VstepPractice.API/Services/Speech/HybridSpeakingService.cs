using Betalgo.Ranul.OpenAI.Interfaces;
using Betalgo.Ranul.OpenAI.ObjectModels.RequestModels;
using Microsoft.Extensions.Options;
using Polly.Retry;
using Polly;
using System.Text;
using System.Text.Json;
using VstepPractice.API.Common.Utils;
using VstepPractice.API.Models.DTOs.AI;
using VstepPractice.API.Services.AI;
using VstepPractice.API.Services.Storage;

namespace VstepPractice.API.Services.Speech;

public class HybridSpeakingService : ISpeakingAssessmentService
{
    private readonly IOpenAIService _openAiService;
    private readonly IAzurePronunciationService _pronService;
    private readonly IFileStorageService _storageService;
    private readonly ILogger<HybridSpeakingService> _logger;
    private readonly OpenAiOptions _options;
    private readonly AsyncRetryPolicy<Result<SpeakingAssessmentResponse>> _retryPolicy;

    public HybridSpeakingService(
        IOpenAIService openAiService,
        IAzurePronunciationService pronService,
        IFileStorageService storageService,
        IOptions<OpenAiOptions> options,
        ILogger<HybridSpeakingService> logger)
    {
        _openAiService = openAiService;
        _pronService = pronService;
        _storageService = storageService;
        _options = options.Value;
        _logger = logger;

        _retryPolicy = Policy<Result<SpeakingAssessmentResponse>>
            .Handle<HttpRequestException>()
            .Or<TimeoutException>()
            .WaitAndRetryAsync(
                _options.MaxRetries,
                retryAttempt => TimeSpan.FromSeconds(Math.Pow(2, retryAttempt)),
                (exception, timeSpan, retryCount, _) =>
                {
                    _logger.LogWarning(
                        exception.Exception,
                        "Error attempting to assess speaking. Retry {RetryCount} of {MaxRetries} after {DelaySeconds} seconds",
                        retryCount,
                        _options.MaxRetries,
                        timeSpan.TotalSeconds);
                });
    }

    public Task<Result<WritingAssessmentResponse>> AssessEssayAsync(
        EssayScoringTask task,
        CancellationToken cancellationToken = default)
    {
        throw new NotImplementedException();
    }

    public async Task<Result<SpeakingAssessmentResponse>> AssessSpeakingAsync(
        SpeakingAssessmentTask task,
        CancellationToken cancellationToken = default)
    {
        return await _retryPolicy.ExecuteAsync(async () =>
        {
            try
            {
                using var cts = CancellationTokenSource
                    .CreateLinkedTokenSource(cancellationToken);
                cts.CancelAfter(TimeSpan.FromSeconds(_options.TimeoutSeconds));

                // 1. Get Azure Pronunciation scores
                using var audioStream = await _storageService.DownloadFileAsync(task.AudioUrl);
                var pronResult = await _pronService.AssessAudioAsync(
                    audioStream,
                    task.QuestionText,
                    cts.Token);

                // 2. Save detailed pronunciation results to blob
                var jsonUrl = await _storageService.UploadFileAsync(
                    new MemoryStream(Encoding.UTF8.GetBytes(pronResult.DetailedResultJson)),
                    $"pron_{task.AnswerId}.json",
                    "application/json");

                // 3. Get OpenAI assessment for content
                var prompt = @$"As a VSTEP speaking examiner, assess this response:
Title: {task.PassageTitle}
Context: {task.PassageContent}
Question: {task.QuestionText}
Student's Response: {pronResult.RecognizedText}

Current pronunciation scores:
- Pronunciation: {pronResult.PronScore:F1}/100
- Fluency: {pronResult.FluencyScore:F1}/100
- Accuracy: {pronResult.AccuracyScore:F1}/100
- Prosody: {pronResult.ProsodyScore:F1}/100

Please provide:
1. Scores (0-100) for:
   - Grammar
   - Vocabulary
   - Topic Development
2. Detailed feedback with:
   - Strengths
   - Areas for improvement
   - Specific suggestions for practice

Return as JSON with exact format:
{{
    ""grammarScore"": decimal,
    ""vocabularyScore"": decimal,
    ""topicScore"": decimal,
    ""feedback"": {{
        ""strengths"": string[],
        ""weaknesses"": string[],
        ""suggestions"": string[]
    }}
}}";

                var completionResult = await _openAiService.ChatCompletion.CreateCompletion(
                    new ChatCompletionCreateRequest
                    {
                        Messages = new List<ChatMessage>
                        {
                            ChatMessage.FromSystem("You are a VSTEP speaking examiner"),
                            ChatMessage.FromUser(prompt)
                        },
                        Model = _options.ModelName,
                        Temperature = 0.7f,
                    },
                    cancellationToken: cts.Token);

                if (!completionResult.Successful)
                {
                    throw new Exception(completionResult.Error?.Message);
                }

                var responseContent = completionResult.Choices.First().Message.Content;
                var aiResult = JsonSerializer.Deserialize<JsonDocument>(responseContent)?.RootElement;

                if (aiResult == null)
                {
                    throw new Exception("Failed to parse AI response");
                }

                // 4. Combine results
                var response = new SpeakingAssessmentResponse
                {
                    // Azure scores
                    PronScore = pronResult.PronScore,
                    AccuracyScore = pronResult.AccuracyScore,
                    FluencyScore = pronResult.FluencyScore,
                    ProsodyScore = pronResult.ProsodyScore,

                    // OpenAI scores
                    GrammarScore = decimal.Parse(aiResult.Value.GetProperty("grammarScore").ToString()),
                    VocabularyScore = decimal.Parse(aiResult.Value.GetProperty("vocabularyScore").ToString()),
                    TopicScore = decimal.Parse(aiResult.Value.GetProperty("topicScore").ToString()),

                    // Text content
                    RecognizedText = pronResult.RecognizedText,
                    DetailedResultUrl = jsonUrl,
                    DetailedFeedback = FormatFeedback(pronResult, aiResult.Value.GetProperty("feedback"))
                };

                return Result.Success(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error assessing speaking response");
                return Result.Failure<SpeakingAssessmentResponse>(
                    new Error("SpeakingAssessment.Failed", "Failed to assess speaking response"));
            }
        });
    }

    private string FormatFeedback(
        PronunciationAssessmentResponse pronResult,
        JsonElement feedbackElement)
    {
        var feedback = new StringBuilder();

        // Overall scores
        feedback.AppendLine("Speaking Assessment Results:\n");
        feedback.AppendLine("Pronunciation & Fluency Scores:");
        feedback.AppendLine($"- Pronunciation: {pronResult.PronScore:F1}/100");
        feedback.AppendLine($"- Fluency: {pronResult.FluencyScore:F1}/100");
        feedback.AppendLine($"- Accuracy: {pronResult.AccuracyScore:F1}/100");
        feedback.AppendLine($"- Prosody: {pronResult.ProsodyScore:F1}/100");

        feedback.AppendLine("\nDetailed Feedback:");

        // Add strengths
        feedback.AppendLine("\nStrengths:");
        foreach (var strength in feedbackElement.GetProperty("strengths").EnumerateArray())
        {
            feedback.AppendLine($"✓ {strength.GetString()}");
        }

        // Add areas for improvement
        feedback.AppendLine("\nAreas for Improvement:");
        foreach (var weakness in feedbackElement.GetProperty("weaknesses").EnumerateArray())
        {
            feedback.AppendLine($"• {weakness.GetString()}");
        }

        // Add suggestions
        feedback.AppendLine("\nSuggestions for Practice:");
        foreach (var suggestion in feedbackElement.GetProperty("suggestions").EnumerateArray())
        {
            feedback.AppendLine($"- {suggestion.GetString()}");
        }

        return feedback.ToString();
    }
}