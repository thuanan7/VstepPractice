namespace VstepPractice.API.Services.Speech;

public interface ISpeechToTextService
{
    Task<string> TranscribeAudioAsync(
        Stream audioStream,
        CancellationToken cancellationToken = default);
}