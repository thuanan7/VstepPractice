using Asp.Versioning;
using Microsoft.AspNetCore.Mvc;
using VstepPractice.API.Services.Storage;

namespace VstepPractice.API.Controllers.V1;

[ApiVersion(1)]
public class AudioController : ControllerBase
{
    private readonly IFileStorageService _storageService;

    public AudioController(IFileStorageService storageService)
    {
        _storageService = storageService;
    }

    [HttpPost("upload")]
    public async Task<IActionResult> UploadAudio(IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest("No file uploaded");

        using var stream = file.OpenReadStream();
        var url = await _storageService.UploadFileAsync(
            stream,
            file.FileName,
            file.ContentType);

        return Ok(new { url });
    }
}
