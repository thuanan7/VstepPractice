using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VstepPractice.API.Common.Constant;
using VstepPractice.API.Common.Utils;
using VstepPractice.API.Common.Constant;
using VstepPractice.API.Common.Utils;
using VstepPractice.API.Models.DTOs.Exams.Requests;
using VstepPractice.API.Models.DTOs.Exams.Responses;
using VstepPractice.API.Services.Exams;

namespace VstepPractice.API.Controllers.V1;

[ApiVersion(1)]
[Authorize]
public class StudentAttemptController : ApiController
{
    private readonly IExamService _examService;

    public StudentAttemptController(IExamService examService)
    {
        _examService = examService;
    }

    [HttpGet("test")]
    [ProducesResponseType(typeof(string), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(Error), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetTest(CancellationToken cancellationToken = default)
    {
        var result = await _examService.GetExamsAsync(cancellationToken);
        return Ok(result);
    }
}