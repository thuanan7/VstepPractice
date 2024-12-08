using Microsoft.CognitiveServices.Speech.Audio;
using Microsoft.CognitiveServices.Speech;
using Microsoft.Extensions.Options;
using System.Text;

namespace VstepPractice.API.Services.Speech;

public class AzureSpeechToTextService : ISpeechToTextService
{
    private readonly SpeechConfig _speechConfig;
    private readonly ILogger<AzureSpeechToTextService> _logger;

    public AzureSpeechToTextService(
        IOptions<AzureSpeechOptions> options,
        ILogger<AzureSpeechToTextService> logger)
    {
        _logger = logger;

        _speechConfig = SpeechConfig.FromSubscription(
            options.Value.SubscriptionKey,
            options.Value.Region);

        // Match Speech Studio configuration
        _speechConfig.SpeechRecognitionLanguage = "en-US";

        // Use conversation mode instead of dictation
        _speechConfig.SetServiceProperty(
    "RecognitionMode",
    "Conversation", // hoặc "Interactive"
    ServicePropertyChannel.UriQueryParameter);
    }

    public async Task<string> TranscribeAudioAsync(
    Stream audioStream,
    CancellationToken cancellationToken = default)
    {
        try
        {
            using var pushStream = AudioInputStream.CreatePushStream();
            using var audioConfig = AudioConfig.FromStreamInput(pushStream);
            using var recognizer = new SpeechRecognizer(_speechConfig, audioConfig);

            var resultBuilder = new StringBuilder();
            var taskCompletionSource = new TaskCompletionSource<string>();

            // Recognition handlers
            recognizer.Recognized += (s, e) =>
            {
                if (e.Result.Reason == ResultReason.RecognizedSpeech)
                {
                    _logger.LogInformation(
                        "Confidence: {Confidence}, Text: {Text}",
                        e.Result,
                        e.Result.Text);
                    resultBuilder.AppendLine(e.Result.Text);
                }
            };

            // Log when recognition starts
            recognizer.Recognizing += (s, e) =>
            {
                _logger.LogDebug("Recognizing: {Text}", e.Result.Text);
            };

            // Handle errors
            recognizer.Canceled += (s, e) =>
            {
                if (e.Reason == CancellationReason.EndOfStream)
                {
                    // This is normal completion
                    _logger.LogInformation("Recognition completed normally");
                    taskCompletionSource.TrySetResult(resultBuilder.ToString());
                }
                else if (e.Reason == CancellationReason.Error)
                {
                    _logger.LogError(
                        "Recognition error: ErrorCode={ErrorCode}, ErrorDetails={ErrorDetails}",
                        e.ErrorCode,
                        e.ErrorDetails);
                    taskCompletionSource.TrySetException(
                        new Exception($"Recognition error: {e.ErrorDetails}"));
                }
                else
                {
                    _logger.LogWarning(
                        "Recognition canceled: Reason={Reason}, ErrorDetails={ErrorDetails}",
                        e.Reason,
                        e.ErrorDetails);
                    taskCompletionSource.TrySetResult(resultBuilder.ToString());
                }
            };

            // Handle session end
            recognizer.SessionStarted += (s, e) =>
            {
                _logger.LogInformation("Session started");
            };

            recognizer.SessionStopped += (s, e) =>
            {
                _logger.LogInformation("Session stopped");
                taskCompletionSource.TrySetResult(resultBuilder.ToString());
            };

            // Start recognition
            await recognizer.StartContinuousRecognitionAsync();

            // Write audio data
            byte[] buffer = new byte[8192];
            int bytesRead;
            while ((bytesRead = await audioStream.ReadAsync(buffer, 0, buffer.Length, cancellationToken)) > 0)
            {
                pushStream.Write(buffer, bytesRead);
                _logger.LogDebug("Wrote {BytesRead} bytes to stream", bytesRead);
            }

            // Signal end of audio data
            pushStream.Close();
            _logger.LogInformation("Audio stream closed");

            // Stop recognition after pushing all data
            await recognizer.StopContinuousRecognitionAsync();
            _logger.LogInformation("Recognition stopped");

            // Wait for result with timeout
            using var cts = CancellationTokenSource.CreateLinkedTokenSource(cancellationToken);
            cts.CancelAfter(TimeSpan.FromSeconds(30)); // 30 second timeout

            var transcriptionResult = await taskCompletionSource.Task
                .WaitAsync(cts.Token);

            return transcriptionResult.Trim();
        }
        catch (OperationCanceledException)
        {
            _logger.LogWarning("Transcription timed out");
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error transcribing audio");
            throw;
        }
    }
}
