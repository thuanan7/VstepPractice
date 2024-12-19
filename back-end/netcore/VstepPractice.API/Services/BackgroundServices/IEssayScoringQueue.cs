using VstepPractice.API.Models.DTOs.AI;
namespace VstepPractice.API.Services.BackgroundServices;

public interface IEssayScoringQueue
{
    Task QueueScoringTaskAsync(EssayScoringTask task);
}
