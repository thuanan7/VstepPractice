using VstepPractice.API.Common.Utils;
using VstepPractice.API.Models.DTOs.Exams.Responses;

namespace VstepPractice.API.Services.Exams;

public interface IExamService
{
    Task<Result<PagedResult<ExamResponse>>> GetExamsAsync(
        int pageIndex = 1,
        int pageSize = 10,
        CancellationToken cancellationToken = default);
   
}
