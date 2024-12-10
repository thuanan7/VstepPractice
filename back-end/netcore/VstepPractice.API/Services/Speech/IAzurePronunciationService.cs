using Microsoft.CognitiveServices.Speech.PronunciationAssessment;
using VstepPractice.API.Models.DTOs.AI;

namespace VstepPractice.API.Services.Speech;

public interface IAzurePronunciationService
{
    Task<PronunciationAssessmentResponse> AssessAudioAsync(
        Stream audioStream,
        string topic, // For content assessment 
        CancellationToken cancellationToken = default);
}
