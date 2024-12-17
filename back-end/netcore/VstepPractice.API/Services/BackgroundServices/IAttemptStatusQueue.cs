namespace VstepPractice.API.Services.BackgroundServices;

public interface IAttemptStatusQueue
{
    Task QueueStatusCheckAsync(int attemptId);
}
