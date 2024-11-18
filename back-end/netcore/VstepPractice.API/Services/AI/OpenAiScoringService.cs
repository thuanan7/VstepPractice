using Betalgo.Ranul.OpenAI.Interfaces;
using Betalgo.Ranul.OpenAI.ObjectModels.RequestModels;
using Microsoft.Extensions.Options;
using Polly;
using Polly.Retry;
using System.Text.Json;
using VstepPractice.API.Common.Enums;
using VstepPractice.API.Common.Utils;
using VstepPractice.API.Models.DTOs.AI;

namespace VstepPractice.API.Services.AI;

public class OpenAiScoringService : IAiScoringService
{
    private const decimal MAX_CRITERION_SCORE = 2.5m;

    private readonly IOpenAIService _openAiService;
    private readonly ILogger<OpenAiScoringService> _logger;
    private readonly OpenAiOptions _options;
    private readonly AsyncRetryPolicy<Result<WritingAssessmentResponse>> _retryPolicy;

    public OpenAiScoringService(
        IOpenAIService openAiService,
        IOptions<OpenAiOptions> options,
        ILogger<OpenAiScoringService> logger)
    {
        _openAiService = openAiService;
        _options = options.Value;
        _logger = logger;

        _retryPolicy = Policy<Result<WritingAssessmentResponse>>
            .Handle<HttpRequestException>()
            .Or<TimeoutException>()
            .WaitAndRetryAsync(
                _options.MaxRetries,
                retryAttempt => TimeSpan.FromSeconds(Math.Pow(2, retryAttempt)),
                (exception, timeSpan, retryCount, _) =>
                {
                    _logger.LogWarning(
                        exception.Exception,
                        "Error attempting to assess essay. Retry {RetryCount} of {MaxRetries} after {DelaySeconds} seconds",
                        retryCount,
                        _options.MaxRetries,
                        timeSpan.TotalSeconds);
                });
    }

    public async Task<Result<WritingAssessmentResponse>> AssessEssayAsync(
        EssayScoringTask task,
        CancellationToken cancellationToken = default)
    {
        if (task.SectionType != SectionTypes.Writing)
        {
            return Result.Failure<WritingAssessmentResponse>(
                new Error("AiScoring.InvalidSectionType", "Only writing tasks can be assessed."));
        }

        return await _retryPolicy.ExecuteAsync(async () =>
        {
            try
            {
                using var cts = CancellationTokenSource
                    .CreateLinkedTokenSource(cancellationToken);
                cts.CancelAfter(TimeSpan.FromSeconds(_options.TimeoutSeconds));

                var systemMessage = @"You are a VSTEP B2 writing examiner. Score the essay based on these criteria:
1. Task Achievement (0-2.5 points): How well the response addresses all points in the task
2. Coherence & Cohesion (0-2.5 points): Text organization and use of linking devices
3. Lexical Resource (0-2.5 points): Vocabulary range and accuracy
4. Grammar Accuracy (0-2.5 points): Range and accuracy of grammatical structures

IMPORTANT: Each criterion MUST be scored between 0 and 2.5 points. DO NOT exceed 2.5 points per criterion.
Maximum total score possible is 10 points (2.5 x 4).

Return response as a JSON object with these exact score ranges:
taskAchievement: decimal (0-2.5)
coherenceCohesion: decimal (0-2.5)
lexicalResource: decimal (0-2.5)
grammarAccuracy: decimal (0-2.5)
detailedFeedback: { strengths: [], weaknesses: [], grammarErrors: [], suggestions: [] }

FOR TESTING:
If you see the string 'TestLLM (point)', please provide a score for each criterion such that the sum of all scores equals (point). Additionally, provide feedback based on that score. Thank you!

Example:
Input: TestLLM 7
Output: taskAchievement: 2.0, coherenceCohesion: 2.0, lexicalResource: 1.0, grammarAccuracy: 2.0
Explanation: 2.0 + 2.0 + 1.0 + 2.0 = 7";

                var userMessage = $@"Please assess the following VSTEP B2 writing task.

Task Title: {task.PassageTitle}

Task Description:
{task.PassageContent}

Question:
{task.QuestionText}

Student's Essay:
{task.Essay}";

                var completionResult = await _openAiService.ChatCompletion.CreateCompletion(
                    new ChatCompletionCreateRequest
                    {
                        Messages = new List<ChatMessage>
                        {
                            ChatMessage.FromSystem(systemMessage),
                            ChatMessage.FromUser(userMessage)
                        },
                        Model = _options.ModelName,
                        Temperature = 0.7f,
                        MaxTokens = 4096
                    },
                    cancellationToken: cts.Token);

                if (!completionResult.Successful)
                {
                    throw new Exception(completionResult.Error?.Message);
                }

                var responseContent = completionResult.Choices.First().Message.Content;
                responseContent = CleanJsonResponse(responseContent);

                try
                {
                    var assessmentData = JsonSerializer.Deserialize<JsonDocument>(responseContent);
                    var root = assessmentData.RootElement;

                    // Log parsed scores
                    _logger.LogInformation(
                        "Parsed scores for answerId {AnswerId}:\n" +
                        "TaskAchievement: {TaskAchievement}\n" +
                        "CoherenceCohesion: {CoherenceCohesion}\n" +
                        "LexicalResource: {LexicalResource}\n" +
                        "GrammarAccuracy: {GrammarAccuracy}",
                        task.AnswerId,
                        root.GetProperty("taskAchievement").GetDecimal(),
                        root.GetProperty("coherenceCohesion").GetDecimal(),
                        root.GetProperty("lexicalResource").GetDecimal(),
                        root.GetProperty("grammarAccuracy").GetDecimal());

                    // Get scores and validate/normalize them
                    var scores = ValidateAndNormalizeScores(
                        root.GetProperty("taskAchievement").GetDecimal(),
                        root.GetProperty("coherenceCohesion").GetDecimal(),
                        root.GetProperty("lexicalResource").GetDecimal(),
                        root.GetProperty("grammarAccuracy").GetDecimal());

                    // Get feedback
                    var feedbackObj = root.GetProperty("detailedFeedback");
                    var feedback = FormatFeedback(feedbackObj, scores);
                    scores.DetailedFeedback = feedback;

                    // Log if original scores were normalized
                    var originalTotal = root.GetProperty("taskAchievement").GetDecimal() +
                                      root.GetProperty("coherenceCohesion").GetDecimal() +
                                      root.GetProperty("lexicalResource").GetDecimal() +
                                      root.GetProperty("grammarAccuracy").GetDecimal();

                    if (originalTotal != scores.TotalScore)
                    {
                        _logger.LogWarning(
                            "AI scores were normalized. Original: {OriginalTotal}, Normalized: {NormalizedTotal}",
                            originalTotal, scores.TotalScore);
                    }

                    return Result.Success(scores);
                }
                catch (JsonException ex)
                {
                    _logger.LogError(ex, "Failed to parse AI response: {Response}", responseContent);
                    return Result.Failure<WritingAssessmentResponse>(
                        new Error("AiScoring.InvalidResponse", "Invalid scoring format received."));
                }
            }
            catch (OperationCanceledException) when (cancellationToken.IsCancellationRequested)
            {
                throw;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error assessing essay for answerId {AnswerId}", task.AnswerId);
                return Result.Failure<WritingAssessmentResponse>(
                    new Error("AiScoring.Failed", "Failed to assess essay. Please try again later."));
            }
        });
    }
    private static string CleanJsonResponse(string response)
    {
        // Remove markdown code block if present
        if (response.StartsWith("```json"))
        {
            response = response.Replace("```json", "").Replace("```", "").Trim();
        }
        else if (response.StartsWith("```"))
        {
            response = response.Replace("```", "").Trim();
        }
        return response;
    }

    private static WritingAssessmentResponse ValidateAndNormalizeScores(
        decimal taskAchievement,
        decimal coherenceCohesion,
        decimal lexicalResource,
        decimal grammarAccuracy)
    {
        // Ensure each score is between 0 and 2.5
        decimal NormalizeScore(decimal score) =>
            Math.Min(Math.Max(score, 0), MAX_CRITERION_SCORE);

        var normalizedScores = new WritingAssessmentResponse
        {
            TaskAchievement = NormalizeScore(taskAchievement),
            CoherenceCohesion = NormalizeScore(coherenceCohesion),
            LexicalResource = NormalizeScore(lexicalResource),
            GrammarAccuracy = NormalizeScore(grammarAccuracy)
        };

        return normalizedScores;
    }

    private static string FormatFeedback(
        JsonElement feedbackObj,
        WritingAssessmentResponse scores)
    {
        var strengths = string.Join("\n", feedbackObj.GetProperty("strengths")
            .EnumerateArray()
            .Select(x => $"- {x.GetString()}"));
        var weaknesses = string.Join("\n", feedbackObj.GetProperty("weaknesses")
            .EnumerateArray()
            .Select(x => $"- {x.GetString()}"));
        var grammarErrors = string.Join("\n", feedbackObj.GetProperty("grammarErrors")
            .EnumerateArray()
            .Select(x => $"- {x.GetString()}"));
        var suggestions = string.Join("\n", feedbackObj.GetProperty("suggestions")
            .EnumerateArray()
            .Select(x => $"- {x.GetString()}"));

        return $@"Writing Assessment Scores:
Task Achievement: {scores.TaskAchievement:F1}/2.5
Coherence & Cohesion: {scores.CoherenceCohesion:F1}/2.5
Lexical Resource: {scores.LexicalResource:F1}/2.5
Grammar Accuracy: {scores.GrammarAccuracy:F1}/2.5
Total Score: {scores.TotalScore:F1}/10

Strengths:
{strengths}

Areas for Improvement:
{weaknesses}

Grammar Errors:
{grammarErrors}

Suggestions:
{suggestions}";
    }
}