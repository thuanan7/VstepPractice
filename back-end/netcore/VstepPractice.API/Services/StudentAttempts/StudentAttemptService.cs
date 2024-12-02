using AutoMapper;
using VstepPractice.API.Common.Enums;
using VstepPractice.API.Common.Utils;
using VstepPractice.API.Models.DTOs.AI;
using VstepPractice.API.Models.DTOs.StudentAttempts.Requests;
using VstepPractice.API.Models.DTOs.StudentAttempts.Responses;
using VstepPractice.API.Models.Entities;
using VstepPractice.API.Repositories.Interfaces;
using VstepPractice.API.Services.AI;
using VstepPractice.API.Services.ScoreCalculation;

namespace VstepPractice.API.Services.StudentAttempts;

public class StudentAttemptService : IStudentAttemptService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly IEssayScoringQueue _scoringQueue;
    private readonly IVstepScoreCalculator _scoreCalculator;
    private readonly ILogger<StudentAttemptService> _logger;

    public StudentAttemptService(
        IUnitOfWork unitOfWork,
        IMapper mapper,
        IEssayScoringQueue scoringQueue,
        IVstepScoreCalculator scoreCalculator,
        ILogger<StudentAttemptService> logger)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _scoringQueue = scoringQueue;
        _logger = logger;
        _scoreCalculator = scoreCalculator;
    }

    public async Task<Result<AttemptResponse>> StartAttemptAsync(
        int userId,
        StartAttemptRequest request,
        CancellationToken cancellationToken = default)
    {
        var exam = await _unitOfWork.ExamRepository.FindByIdAsync(
            request.ExamId, cancellationToken);

        if (exam == null)
            return Result.Failure<AttemptResponse>(Error.NotFound);

        // Check if user has any in-progress attempts
        var hasInProgressAttempt = await _unitOfWork.StudentAttemptRepository
            .HasInProgressAttempt(userId, request.ExamId, cancellationToken);

        if (hasInProgressAttempt)
            return Result.Failure<AttemptResponse>(
                new Error("Attempt.InProgress", "You have an in-progress attempt for this exam."));

        var attempt = new StudentAttempt
        {
            UserId = userId,
            ExamId = request.ExamId,
            StartTime = DateTime.UtcNow,
            Status = AttemptStatus.InProgress
        };

        _unitOfWork.StudentAttemptRepository.Add(attempt);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        var response = _mapper.Map<AttemptResponse>(attempt);
        return Result.Success(response);
    }

    public async Task<Result<AnswerResponse>> SubmitAnswerAsync(
    int userId,
    int attemptId,
    SubmitAnswerRequest request,
    CancellationToken cancellationToken = default)
    {
        var attempt = await _unitOfWork.StudentAttemptRepository
            .FindByIdAsync(attemptId, cancellationToken);

        if (attempt == null || attempt.UserId != userId)
            return Result.Failure<AnswerResponse>(Error.NotFound);

        if (attempt.Status != AttemptStatus.InProgress)
            return Result.Failure<AnswerResponse>(
                new Error("Attempt.NotInProgress", "This attempt is not in progress."));

        // Get question to verify it exists and get section type
        var question = await _unitOfWork.QuestionRepository
            .FindByIdAsync(request.QuestionId, cancellationToken, q => q.Section);

        if (question == null)
            return Result.Failure<AnswerResponse>(
                new Error("Question.NotFound", "Question not found."));

        // Check if answer already exists
        var existingAnswer = await _unitOfWork.AnswerRepository
            .FindSingleAsync(a =>
                a.AttemptId == attemptId &&
                a.QuestionId == request.QuestionId,
                cancellationToken);

        Answer answer;
        if (existingAnswer != null)
        {
            answer = existingAnswer;
        }
        else
        {
            answer = new Answer
            {
                AttemptId = attemptId,
                QuestionId = request.QuestionId
            };
            _unitOfWork.AnswerRepository.Add(answer);
        }

        // Handle different section types
        switch (question.Section.SectionType)
        {
            case SectionTypes.Writing:
                answer.EssayAnswer = request.EssayAnswer;
                answer.QuestionOptionId = null; // Explicitly set to null for writing
                answer.Score = null; // Reset score as it will be set by AI
                answer.AiFeedback = null; // Reset feedback as it will be set by AI
                break;

            case SectionTypes.Reading:
            case SectionTypes.Listening:
                if (!request.SelectedOptionId.HasValue)
                {
                    return Result.Failure<AnswerResponse>(
                        new Error("Answer.OptionRequired", "Multiple choice answer requires a selected option."));
                }

                // Verify the selected option exists and belongs to this question
                var selectedOption = await _unitOfWork.QuestionOptions
                    .FindByIdAsync(request.SelectedOptionId.Value, cancellationToken);

                if (selectedOption == null || selectedOption.QuestionId != question.Id)
                {
                    return Result.Failure<AnswerResponse>(
                        new Error("Answer.InvalidOption", "Selected option is not valid for this question."));
                }

                answer.EssayAnswer = null; // Reset essay answer for multiple choice
                answer.QuestionOptionId = request.SelectedOptionId;
                answer.AiFeedback = null;
                // Calculate score immediately for multiple choice
                answer.Score = selectedOption.IsCorrect ? question.Point : 0;
                break;

            default:
                _logger.LogError(
                    "Unsupported section type {SectionType} for question {QuestionId}",
                    question.Section.SectionType, question.Id);
                throw new NotSupportedException(
                    $"Section type {question.Section.SectionType} is not supported.");
        }

        if (existingAnswer != null)
        {
            _unitOfWork.AnswerRepository.Update(answer);
        }

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        var response = _mapper.Map<AnswerResponse>(answer);

        // If it's a writing answer, get the assessment if it exists
        if (question.Section.SectionType == SectionTypes.Writing)
        {
            var assessment = await _unitOfWork.WritingAssessmentRepository
                .GetByAnswerIdAsync(answer.Id, cancellationToken);

            if (assessment != null)
            {
                response.WritingScore = new WritingScoreDetails
                {
                    TaskAchievement = assessment.TaskAchievement,
                    CoherenceCohesion = assessment.CoherenceCohesion,
                    LexicalResource = assessment.LexicalResource,
                    GrammarAccuracy = assessment.GrammarAccuracy
                };
            }

            // Queue for assessment if has essay answer
            if (!string.IsNullOrEmpty(request.EssayAnswer))
            {
                await _scoringQueue.QueueScoringTaskAsync(new EssayScoringTask
                {
                    AnswerId = answer.Id,
                    PassageTitle = question.Section.Title,
                    PassageContent = question.Section.Content ?? string.Empty,
                    QuestionText = question.QuestionText ?? string.Empty,
                    Essay = request.EssayAnswer,
                    SectionType = question.Section.SectionType
                });
            }
        }

        return Result.Success(response);
    }

    public async Task<Result<AttemptResultResponse>> FinishAttemptAsync(
        int userId,
        FinishAttemptRequest request,
        CancellationToken cancellationToken = default)
    {
        var attempt = await _unitOfWork.StudentAttemptRepository
            .FindByIdAsync(request.AttemptId, cancellationToken);

        if (attempt == null || attempt.UserId != userId)
            return Result.Failure<AttemptResultResponse>(Error.NotFound);

        if (attempt.Status != AttemptStatus.InProgress)
            return Result.Failure<AttemptResultResponse>(
                new Error("Attempt.NotInProgress", "This attempt is not in progress."));

        attempt.EndTime = DateTime.UtcNow;
        attempt.Status = AttemptStatus.Completed;

        _unitOfWork.StudentAttemptRepository.Update(attempt);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return await GetAttemptResultAsync(userId, request.AttemptId, cancellationToken);
    }

    public async Task<Result<AttemptResultResponse>> GetAttemptResultAsync(
    int userId,
    int attemptId,
    CancellationToken cancellationToken = default)
    {
        var attempt = await _unitOfWork.StudentAttemptRepository
            .GetAttemptWithDetailsAsync(attemptId, cancellationToken);

        if (attempt == null || attempt.UserId != userId)
            return Result.Failure<AttemptResultResponse>(Error.NotFound);

        if (attempt.Status != AttemptStatus.Completed)
            return Result.Failure<AttemptResultResponse>(
                new Error("Attempt.NotCompleted", "This attempt is not completed."));

        // Calculate scores using VstepScoreCalculator
        var score = await _scoreCalculator.CalculateScoreAsync(attempt, cancellationToken);

        // Map answers and include writing assessments
        var answers = new List<AnswerResponse>();
        foreach (var answer in attempt.Answers)
        {
            var answerResponse = _mapper.Map<AnswerResponse>(answer);

            if (answer.Question.Section.SectionType == SectionTypes.Writing)
            {
                var assessment = await _unitOfWork.WritingAssessmentRepository
                    .GetByAnswerIdAsync(answer.Id, cancellationToken);

                if (assessment != null)
                {
                    answerResponse.WritingScore = new WritingScoreDetails
                    {
                        TaskAchievement = assessment.TaskAchievement,
                        CoherenceCohesion = assessment.CoherenceCohesion,
                        LexicalResource = assessment.LexicalResource,
                        GrammarAccuracy = assessment.GrammarAccuracy
                    };
                }
            }

            answers.Add(answerResponse);
        }

        var result = new AttemptResultResponse
        {
            Id = attempt.Id,
            ExamTitle = attempt.Exam.Title!,
            StartTime = attempt.StartTime,
            EndTime = attempt.EndTime!.Value,
            Answers = answers,
            SectionScores = score.SectionScores.ToDictionary(
                kvp => kvp.Key,
                kvp => kvp.Value.Score),
            FinalScore = score.FinalScore
        };

        return Result.Success(result);
    }
}