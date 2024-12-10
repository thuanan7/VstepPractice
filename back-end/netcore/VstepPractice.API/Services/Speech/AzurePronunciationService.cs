using Microsoft.CognitiveServices.Speech;
using Microsoft.CognitiveServices.Speech.Audio;
using Microsoft.CognitiveServices.Speech.PronunciationAssessment;
using Microsoft.Extensions.Options;
using System.Text.Json;
using VstepPractice.API.Common.Utils;
using VstepPractice.API.Models.DTOs.AI;

namespace VstepPractice.API.Services.Speech;

public class AzurePronunciationService : IAzurePronunciationService
{
    private readonly SpeechConfig _speechConfig;
    private readonly ILogger<AzurePronunciationService> _logger;

    public AzurePronunciationService(
        IOptions<AzureSpeechOptions> options,
        ILogger<AzurePronunciationService> logger)
    {
        _logger = logger;
        _speechConfig = SpeechConfig.FromSubscription(
            options.Value.SubscriptionKey,
            options.Value.Region);
        _speechConfig.SpeechRecognitionLanguage = "en-US";
    }

    public async Task<PronunciationAssessmentResponse> AssessAudioAsync(
        Stream audioStream,
        string topic,
        CancellationToken cancellationToken = default)
    {
        try
        {
            using var wavStream = await AudioUtils.ConvertM4aToWav(audioStream);

            _logger.LogInformation(
                "Converted audio stream - Length: {Length}, Position: {Position}",
                wavStream.Length,
                wavStream.Position);

            using var pushStream = AudioInputStream.CreatePushStream(
                AudioStreamFormat.GetWaveFormatPCM(16000, 16, 1));
            using var audioInput = AudioConfig.FromStreamInput(pushStream);
            using var recognizer = new SpeechRecognizer(_speechConfig, audioInput);

            var referenceText = $"This is a response about {topic}";

            var pronConfig = new PronunciationAssessmentConfig(
                referenceText, // Empty reference text
                GradingSystem.HundredMark,
                Granularity.Phoneme,
                enableMiscue: false);

            pronConfig.EnableProsodyAssessment();
            pronConfig.EnableContentAssessmentWithTopic(topic);
            pronConfig.ApplyTo(recognizer);

            var assessmentResult = new PronunciationAssessmentResponse();
            var recognizedTexts = new List<string>();
            var taskCompletionSource = new TaskCompletionSource<bool>();

            recognizer.Recognized += (s, e) => {
                if (e.Result.Reason == ResultReason.RecognizedSpeech && !string.IsNullOrEmpty(e.Result.Text))
                {
                    try
                    {
                        _logger.LogInformation(
                            "Recognition Event - Text: {Text}",
                            e.Result.Text);

                        recognizedTexts.Add(e.Result.Text);

                        var pronResult = PronunciationAssessmentResult.FromResult(e.Result);

                        if (pronResult != null)
                        {
                            // Update scores
                            assessmentResult.AccuracyScore = (decimal)pronResult.AccuracyScore;
                            assessmentResult.FluencyScore = (decimal)pronResult.FluencyScore;
                            assessmentResult.PronScore = (decimal)pronResult.PronunciationScore;
                            assessmentResult.ProsodyScore = (decimal)pronResult.ProsodyScore;

                            // Content scores
                            var contentResult = pronResult.ContentAssessmentResult;
                            if (contentResult != null)
                            {
                                assessmentResult.GrammarScore = (decimal)contentResult.GrammarScore;
                                assessmentResult.VocabularyScore = (decimal)contentResult.VocabularyScore;
                                assessmentResult.TopicScore = (decimal)contentResult.TopicScore;
                            }

                            // Word assessments
                            foreach (var word in pronResult.Words)
                            {
                                var wordAssessment = new WordAssessmentResult
                                {
                                    Word = word.Word,
                                    AccuracyScore = (decimal)word.AccuracyScore,
                                    ErrorType = word.ErrorType,
                                };

                                // Add phoneme details if available
                                if (word.Phonemes != null)
                                {
                                    wordAssessment.Phonemes = word.Phonemes.Select(p =>
                                        new PhonemeAssessment
                                        {
                                            Phoneme = p.Phoneme,
                                            AccuracyScore = (decimal)p.AccuracyScore
                                        }).ToList();
                                }

                                assessmentResult.Words.Add(wordAssessment);
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "Error processing recognition result");
                    }
                }
            };

            recognizer.Recognizing += (s, e) => {
                _logger.LogDebug(
                    "Recognizing speech... Partial text: {Text}",
                    e.Result.Text);
            };

            recognizer.Canceled += (s, e) => {
                if (e.Reason == CancellationReason.Error)
                {
                    _logger.LogError(
                        "Assessment error: {ErrorCode} - {ErrorDetails}",
                        e.ErrorCode,
                        e.ErrorDetails);
                    taskCompletionSource.TrySetException(
                        new Exception($"Assessment canceled: {e.ErrorDetails}"));
                }
                else
                {
                    taskCompletionSource.TrySetResult(true);
                }
            };

            recognizer.SessionStopped += (s, e) => {
                _logger.LogInformation("Assessment session stopped");
                taskCompletionSource.TrySetResult(true);
            };

            await recognizer.StartContinuousRecognitionAsync();

            // Write audio data
            byte[] buffer = new byte[8192];
            int bytesRead;
            var totalBytesWritten = 0;

            while ((bytesRead = await wavStream.ReadAsync(buffer, 0, buffer.Length, cancellationToken)) > 0)
            {
                pushStream.Write(buffer, bytesRead);
                totalBytesWritten += bytesRead;
                _logger.LogDebug("Wrote {BytesRead} bytes. Total: {Total}", bytesRead, totalBytesWritten);
            }

            _logger.LogInformation("Finished writing audio data. Total: {TotalBytes}", totalBytesWritten);
            pushStream.Close();

            // Wait for completion with timeout
            using var cts = CancellationTokenSource.CreateLinkedTokenSource(cancellationToken);
            cts.CancelAfter(TimeSpan.FromSeconds(300));

            await taskCompletionSource.Task.WaitAsync(cts.Token);
            await recognizer.StopContinuousRecognitionAsync();

            // Set final results
            assessmentResult.RecognizedText = string.Join(" ", recognizedTexts);

            // Create detailed JSON result
            var jsonResponse = new
            {
                RecognizedText = assessmentResult.RecognizedText,
                Scores = new
                {
                    Pronunciation = assessmentResult.PronScore,
                    Accuracy = assessmentResult.AccuracyScore,
                    Fluency = assessmentResult.FluencyScore,
                    Prosody = assessmentResult.ProsodyScore,
                    Grammar = assessmentResult.GrammarScore,
                    Vocabulary = assessmentResult.VocabularyScore,
                    Topic = assessmentResult.TopicScore
                },
                Words = assessmentResult.Words.Select(w => new
                {
                    w.Word,
                    w.AccuracyScore,
                    w.ErrorType,
                    Phonemes = w.Phonemes?.Select(p => new
                    {
                        p.Phoneme,
                        p.AccuracyScore,
                        Offset = p.Offset,
                        Duration = p.Duration
                    })
                })
            };

            assessmentResult.DetailedResultJson = JsonSerializer.Serialize(
                jsonResponse,
                new JsonSerializerOptions { WriteIndented = true });

            return assessmentResult;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during pronunciation assessment");
            throw;
        }
    }
}