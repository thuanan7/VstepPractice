using VstepPractice.API.Models.DTOs.AI;

namespace VstepPractice.API.Services.BackgroundServices;

public interface ISpeakingAssessmentQueue
{
    Task QueueAssessmentTaskAsync(SpeakingAssessmentTask task);
}
