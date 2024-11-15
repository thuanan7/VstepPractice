using VstepPractice.API.Common.Utils;
using VstepPractice.API.Models.DTOs.Exams.Responses;

namespace VstepPractice.API.Services.Exams;

public interface IExamService
{
    Task<Result<String>> GetExamsAsync(
        CancellationToken cancellationToken = default);
   
}
