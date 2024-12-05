using Betalgo.Ranul.OpenAI.Interfaces;
using Betalgo.Ranul.OpenAI.ObjectModels.RequestModels;

namespace VstepPractice.API.Services.Speech;

public class WhisperTranscriptionService : IAudioTranscriptionService
{
    private readonly IOpenAIService _openAiService;
    private readonly ILogger<WhisperTranscriptionService> _logger;

    public WhisperTranscriptionService(
        IOpenAIService openAiService,
        ILogger<WhisperTranscriptionService> logger)
    {
        _openAiService = openAiService;
        _logger = logger;
    }

    public async Task<string> TranscribeAudioAsync(
    Stream audioStream,
    CancellationToken cancellationToken = default)
    {
        try
        {
            // Convert stream to file required by OpenAI API
            var tempFile = Path.GetTempFileName() + ".m4a";
            using (var fileStream = File.Create(tempFile))
            {
                await audioStream.CopyToAsync(fileStream, cancellationToken);
            }

            // Read file content into a byte array
            var fileBytes = await File.ReadAllBytesAsync(tempFile, cancellationToken);

            var response = await _openAiService.Audio.CreateTranscription(new AudioCreateTranscriptionRequest
            {
                File = fileBytes,
                FileName = Path.GetFileName(tempFile), // Provide a valid file name
                Model = "whisper-1",
                Language = "en",
                ResponseFormat = "text"
            }, cancellationToken);

            // Delete temp file
            File.Delete(tempFile);

            if (!response.Successful)
            {
                throw new Exception($"Transcription failed: {response.Error?.Message}");
            }

            _logger.LogInformation(
                "Audio transcribed successfully. Length: {TextLength}",
                response.Text?.Length ?? 0);

            return response.Text ?? string.Empty;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error transcribing audio using Whisper");
            throw;
        }
    }

}