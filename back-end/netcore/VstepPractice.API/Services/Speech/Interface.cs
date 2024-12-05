namespace VstepPractice.API.Services.Speech;

public interface IAudioTranscriptionService
{
    Task<string> TranscribeAudioAsync(
        Stream audioStream,
        CancellationToken cancellationToken = default);
}
