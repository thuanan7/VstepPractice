﻿using Asp.Versioning;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using VstepPractice.API.Common.Utils;
using VstepPractice.API.Models.DTOs.StudentAttempts.Requests;
using VstepPractice.API.Models.DTOs.StudentAttempts.Responses;
using VstepPractice.API.Services.StudentAttempts;

namespace VstepPractice.API.Controllers.V1;

[ApiVersion(1)]
public class StudentAttemptController : ApiController
{
    private readonly IStudentAttemptService _studentAttemptService;

    public StudentAttemptController(IStudentAttemptService studentAttemptService)
    {
        _studentAttemptService = studentAttemptService;
    }

    [HttpGet("test")]
    [ProducesResponseType(typeof(string), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(Error), StatusCodes.Status404NotFound)]
    public ActionResult GetTest(CancellationToken cancellationToken = default)
    {
        return Ok("You connected to .NetServer");
    }
    /// <summary>
    /// Start a new exam attempt
    /// </summary>
    [HttpPost("start")]
    [ProducesResponseType(typeof(AttemptResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(Error), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> StartAttempt(
        [FromBody] StartAttemptRequest request,
        CancellationToken cancellationToken)
    {
        var userId = request.UserId;
        var result = await _studentAttemptService.StartAttemptAsync(
            userId, request, cancellationToken);

        if (!result.IsSuccess)
            return BadRequest(result.Error);

        return CreatedAtAction(
            nameof(GetAttemptResult),
            new { attemptId = result.Value.Id },
            result.Value);
    }

    /// <summary>
    /// Submit an answer for a question
    /// </summary>
    [HttpPost("{attemptId}/submit-answer")]
    [ProducesResponseType(typeof(AnswerResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(Error), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(Error), StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> SubmitAnswer(
        int attemptId,
        [FromBody] SubmitAnswerRequest request,
        CancellationToken cancellationToken)
    {
        var userId = request.userId;
        var result = await _studentAttemptService.SubmitAnswerAsync(
            userId, attemptId, request, cancellationToken);

        if (!result.IsSuccess)
            return result.Error == Error.NotFound ? NotFound(result.Error) : BadRequest(result.Error);

        return Ok(result.Value);
    }

    /// <summary>
    /// Finish an exam attempt
    /// </summary>
    [HttpPost("{attemptId}/finish")]
    [ProducesResponseType(typeof(AttemptResultResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(Error), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(Error), StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> FinishAttempt(
        int attemptId,
        [FromBody] FinishAttemptRequest request,
        CancellationToken cancellationToken)
    {
        request.AttemptId = attemptId;
        var result = await _studentAttemptService.FinishAttemptAsync(
            request.UserId, request, cancellationToken);

        if (!result.IsSuccess)
            return result.Error == Error.NotFound ? NotFound(result.Error) : BadRequest(result.Error);

        return Ok(result.Value);
    }

    /// <summary>
    /// Get the result of a completed attempt
    /// </summary>
    [HttpGet("{attemptId}/result")]
    [ProducesResponseType(typeof(AttemptResultResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(Error), StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetAttemptResult(
        int attemptId,
        [FromQuery][Required] int userId,
        CancellationToken cancellationToken)
    {
        var result = await _studentAttemptService.GetAttemptResultAsync(
            userId, attemptId, cancellationToken);

        if (!result.IsSuccess)
            return NotFound(result.Error);

        return Ok(result.Value);
    }

}