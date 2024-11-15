using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VstepPractice.API.Common.Constant;
using VstepPractice.API.Common.Utils;
using VstepPractice.API.Models.DTOs.StudentAttempts.Requests;
using VstepPractice.API.Models.DTOs.StudentAttempts.Responses;
namespace VstepPractice.API.Controllers.V1;

[ApiVersion(1)]
[Authorize]
public class StudentAttemptController : ApiController
{

    public StudentAttemptController()
    {
    }
    [HttpGet("test")]
    [ProducesResponseType(typeof(string), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(Error), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetTest()
    {
        return Ok("Now we get the student attempts from VSTEP .NET Core");
    }
}
