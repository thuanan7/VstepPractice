using AutoMapper;
using Microsoft.Extensions.Logging;
using Moq;
using System.Linq.Expressions;
using VstepPractice.API.Common.Enums;
using VstepPractice.API.Common.Utils;
using VstepPractice.API.Models.DTOs.AI;
using VstepPractice.API.Models.DTOs.Scores;
using VstepPractice.API.Models.DTOs.StudentAttempts.Requests;
using VstepPractice.API.Models.DTOs.StudentAttempts.Responses;
using VstepPractice.API.Models.Entities;
using VstepPractice.API.Repositories.Interfaces;
using VstepPractice.API.Services.AI;
using VstepPractice.API.Services.ScoreCalculation;
using VstepPractice.API.Services.StudentAttempts;

namespace VstepPractice.Tests.Services.StudentAttempts;

public class StudentAttemptServiceTests
{
    private readonly Mock<IUnitOfWork> _mockUnitOfWork;
    private readonly Mock<IMapper> _mockMapper;
    private readonly Mock<IEssayScoringQueue> _mockScoringQueue;
    private readonly Mock<ILogger<StudentAttemptService>> _mockLogger;
    private readonly Mock<IVstepScoreCalculator> _mockScoreCalculator;
    private readonly StudentAttemptService _service;

    public StudentAttemptServiceTests()
    {
        _mockUnitOfWork = new Mock<IUnitOfWork>();
        _mockMapper = new Mock<IMapper>();
        _mockScoringQueue = new Mock<IEssayScoringQueue>();
        _mockScoreCalculator = new Mock<IVstepScoreCalculator>();
        _mockLogger = new Mock<ILogger<StudentAttemptService>>();

        _service = new StudentAttemptService(
            _mockUnitOfWork.Object,
            _mockMapper.Object,
            _mockScoringQueue.Object,
            _mockScoreCalculator.Object,
            _mockLogger.Object);
    }

    [Fact]
    public async Task StartAttemptAsync_ExamNotFound_ReturnsNotFoundError()
    {
        // Arrange
        var request = new StartAttemptRequest { UserId = 1, ExamId = 1 };
        _mockUnitOfWork.Setup(x => x.ExamRepository.FindByIdAsync(
            It.IsAny<int>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync((Exam)null!);

        // Act
        var result = await _service.StartAttemptAsync(request.UserId, request, CancellationToken.None);

        // Assert
        Assert.False(result.IsSuccess);
        Assert.Equal(Error.NotFound, result.Error);
    }

    [Fact]
    public async Task StartAttemptAsync_HasInProgressAttempt_ReturnsError()
    {
        // Arrange
        var request = new StartAttemptRequest { UserId = 1, ExamId = 1 };
        var exam = new Exam { Id = 1, Title = "Test Exam" };

        _mockUnitOfWork.Setup(x => x.ExamRepository.FindByIdAsync(
            It.IsAny<int>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(exam);

        _mockUnitOfWork.Setup(x => x.StudentAttemptRepository.HasInProgressAttempt(
            It.IsAny<int>(), It.IsAny<int>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(true);

        // Act
        var result = await _service.StartAttemptAsync(request.UserId, request, CancellationToken.None);

        // Assert
        Assert.False(result.IsSuccess);
        Assert.Equal("Attempt.InProgress", result.Error.Code);
    }

    [Fact]
    public async Task StartAttemptAsync_Success_CreatesNewAttempt()
    {
        // Arrange
        var request = new StartAttemptRequest { UserId = 1, ExamId = 1 };
        var exam = new Exam { Id = 1, Title = "Test Exam" };
        var expectedResponse = new AttemptResponse { Id = 1, ExamId = 1 };

        _mockUnitOfWork.Setup(x => x.ExamRepository.FindByIdAsync(
            It.IsAny<int>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(exam);

        _mockUnitOfWork.Setup(x => x.StudentAttemptRepository.HasInProgressAttempt(
            It.IsAny<int>(), It.IsAny<int>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(false);

        _mockMapper.Setup(x => x.Map<AttemptResponse>(It.IsAny<StudentAttempt>()))
            .Returns(expectedResponse);

        // Act
        var result = await _service.StartAttemptAsync(request.UserId, request, CancellationToken.None);

        // Assert
        Assert.True(result.IsSuccess);
        Assert.Equal(expectedResponse.Id, result.Value.Id);
        _mockUnitOfWork.Verify(x => x.StudentAttemptRepository.Add(It.IsAny<StudentAttempt>()), Times.Once);
        _mockUnitOfWork.Verify(x => x.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task SubmitAnswerAsync_AttemptNotFound_ReturnsNotFoundError()
    {
        // Arrange
        var request = new SubmitAnswerRequest { UserId = 1, QuestionId = 1 };
        _mockUnitOfWork.Setup(x => x.StudentAttemptRepository.FindByIdAsync(
            It.IsAny<int>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync((StudentAttempt)null!);

        // Act
        var result = await _service.SubmitAnswerAsync(1, 1, request, CancellationToken.None);

        // Assert
        Assert.False(result.IsSuccess);
        Assert.Equal(Error.NotFound, result.Error);
    }

    [Fact]
    public async Task SubmitAnswerAsync_AttemptNotInProgress_ReturnsError()
    {
        // Arrange
        var request = new SubmitAnswerRequest { UserId = 1, QuestionId = 1 };
        var attempt = new StudentAttempt
        {
            Id = 1,
            UserId = 1,
            Status = AttemptStatus.Completed
        };

        _mockUnitOfWork.Setup(x => x.StudentAttemptRepository.FindByIdAsync(
            It.IsAny<int>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(attempt);

        // Act
        var result = await _service.SubmitAnswerAsync(1, 1, request, CancellationToken.None);

        // Assert
        Assert.False(result.IsSuccess);
        Assert.Equal("Attempt.NotInProgress", result.Error.Code);
    }

    [Fact]
    public async Task SubmitAnswerAsync_WritingQuestion_QueuesAssessmentTask()
    {
        // Arrange
        var request = new SubmitAnswerRequest
        {
            UserId = 1,
            QuestionId = 1,
            EssayAnswer = "Test essay"
        };

        var attempt = new StudentAttempt
        {
            Id = 1,
            UserId = 1,
            Status = AttemptStatus.InProgress
        };

        var section = new SectionPart
        {
            Id = 1,
            Title = "Writing Section",
            SectionType = SectionTypes.Writing
        };

        var question = new Question
        {
            Id = 1,
            Section = section,
            QuestionText = "Test question"
        };

        var answer = new Answer
        {
            Id = 1,
            AttemptId = attempt.Id,
            QuestionId = question.Id,
            EssayAnswer = request.EssayAnswer
        };

        // Setup mock for AnswerRepository
        _mockUnitOfWork.Setup(x => x.AnswerRepository.FindSingleAsync(
            It.IsAny<Expression<Func<Answer, bool>>>(),
            It.IsAny<CancellationToken>(),
            It.IsAny<Expression<Func<Answer, object>>[]>()))
            .ReturnsAsync((Expression<Func<Answer, bool>> predicate,
                          CancellationToken token,
                          Expression<Func<Answer, object>>[] includes) => null);

        _mockUnitOfWork.Setup(x => x.StudentAttemptRepository.FindByIdAsync(
            It.IsAny<int>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(attempt);

        _mockUnitOfWork.Setup(x => x.QuestionRepository.FindByIdAsync(
            It.IsAny<int>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(question);

        _mockMapper.Setup(x => x.Map<AnswerResponse>(It.IsAny<Answer>()))
            .Returns(new AnswerResponse { Id = answer.Id });

        // Act
        var result = await _service.SubmitAnswerAsync(1, 1, request, CancellationToken.None);

        // Assert
        Assert.True(result.IsSuccess);
        _mockScoringQueue.Verify(
            x => x.QueueScoringTaskAsync(It.Is<EssayScoringTask>(t =>
                t.SectionType == SectionTypes.Writing &&
                t.Essay == request.EssayAnswer)),
            Times.Once);
        _mockUnitOfWork.Verify(x => x.AnswerRepository.Add(It.IsAny<Answer>()), Times.Once);
        _mockUnitOfWork.Verify(x => x.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task GetAttemptResultAsync_CompletedAttempt_ReturnsCorrectResult()
    {
        // Arrange
        var attempt = new StudentAttempt
        {
            Id = 1,
            UserId = 1,
            Status = AttemptStatus.Completed,
            StartTime = DateTime.UtcNow.AddHours(-1),
            EndTime = DateTime.UtcNow,
            Exam = new Exam
            {
                Id = 1,
                Title = "Test Exam",
                SectionParts = new List<SectionPart>
            {
                new SectionPart
                {
                    Id = 1,
                    Title = "Section 1",
                    SectionType = SectionTypes.Reading
                }
            }
            },
            Answers = new List<Answer>
        {
            new Answer
            {
                Id = 1,
                QuestionId = 1,
                Question = new Question
                {
                    Id = 1,
                    QuestionText = "Test Question",
                    Section = new SectionPart
                    {
                        Id = 1,
                        Title = "Section 1",
                        SectionType = SectionTypes.Reading
                    }
                },
                Score = 1
            }
        }
        };

        var mockScore = new VstepScore
        {
            FinalScore = 8.5m,
            SectionScores = new Dictionary<SectionTypes, SectionScore>
            {
                [SectionTypes.Reading] = new SectionScore
                {
                    Score = 8.5m,
                    DetailScores = new Dictionary<string, decimal>
                    {
                        ["Part 1"] = 8.5m
                    }
                }
            }
        };

        var expectedAnswers = new List<AnswerResponse>
    {
        new AnswerResponse
        {
            Id = 1,
            QuestionId = 1,
            QuestionText = "Test Question",
            Score = 1,
            SectionType = SectionTypes.Reading
        }
    };

        _mockUnitOfWork.Setup(x => x.StudentAttemptRepository.GetAttemptWithDetailsAsync(
                It.IsAny<int>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(attempt);

        _mockScoreCalculator.Setup(x => x.CalculateScoreAsync(
                It.IsAny<StudentAttempt>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(mockScore);

        _mockMapper.Setup(x => x.Map<List<AnswerResponse>>(It.IsAny<IEnumerable<Answer>>()))
            .Returns(expectedAnswers);

        // Act
        var result = await _service.GetAttemptResultAsync(1, 1, CancellationToken.None);

        // Assert
        Assert.True(result.IsSuccess);

        var response = result.Value;
        Assert.Equal(attempt.Id, response.Id);
        Assert.Equal(attempt.Exam.Title, response.ExamTitle);
        Assert.Equal(attempt.StartTime, response.StartTime);
        Assert.Equal(attempt.EndTime!.Value, response.EndTime);

        Assert.Single(response.Answers);
        Assert.Equal(expectedAnswers[0].Id, response.Answers[0].Id);
        Assert.Equal(expectedAnswers[0].QuestionText, response.Answers[0].QuestionText);
        Assert.Equal(expectedAnswers[0].SectionType, response.Answers[0].SectionType);

        Assert.Equal(mockScore.FinalScore, response.FinalScore);
        Assert.Equal(mockScore.SectionScores[SectionTypes.Reading].Score,
            response.SectionScores[SectionTypes.Reading]);

        _mockScoreCalculator.Verify(x => x.CalculateScoreAsync(
            It.IsAny<StudentAttempt>(),
            It.IsAny<CancellationToken>()),
            Times.Once);
    }

    [Fact]
    public async Task FinishAttemptAsync_AttemptNotFound_ReturnsNotFoundError()
    {
        // Arrange
        var request = new FinishAttemptRequest { UserId = 1, AttemptId = 1 };

        _mockUnitOfWork.Setup(x => x.StudentAttemptRepository.FindByIdAsync(
            It.IsAny<int>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync((StudentAttempt)null!);

        // Act
        var result = await _service.FinishAttemptAsync(
            request.UserId, request, CancellationToken.None);

        // Assert
        Assert.False(result.IsSuccess);
        Assert.Equal(Error.NotFound, result.Error);
    }

    [Fact]
    public async Task FinishAttemptAsync_WrongUser_ReturnsNotFoundError()
    {
        // Arrange
        var request = new FinishAttemptRequest { UserId = 2, AttemptId = 1 };
        var attempt = new StudentAttempt
        {
            Id = 1,
            UserId = 1, // Different user
            Status = AttemptStatus.InProgress
        };

        _mockUnitOfWork.Setup(x => x.StudentAttemptRepository.FindByIdAsync(
            It.IsAny<int>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(attempt);

        // Act
        var result = await _service.FinishAttemptAsync(
            request.UserId, request, CancellationToken.None);

        // Assert
        Assert.False(result.IsSuccess);
        Assert.Equal(Error.NotFound, result.Error);
    }

    [Fact]
    public async Task FinishAttemptAsync_NotInProgress_ReturnsError()
    {
        // Arrange
        var request = new FinishAttemptRequest { UserId = 1, AttemptId = 1 };
        var attempt = new StudentAttempt
        {
            Id = 1,
            UserId = 1,
            Status = AttemptStatus.Completed // Already completed
        };

        _mockUnitOfWork.Setup(x => x.StudentAttemptRepository.FindByIdAsync(
            It.IsAny<int>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(attempt);

        // Act
        var result = await _service.FinishAttemptAsync(
            request.UserId, request, CancellationToken.None);

        // Assert
        Assert.False(result.IsSuccess);
        Assert.Equal("Attempt.NotInProgress", result.Error.Code);
    }

    [Fact]
    public async Task FinishAttemptAsync_Success_UpdatesAttemptAndReturnsResult()
    {
        // Arrange
        var request = new FinishAttemptRequest { UserId = 1, AttemptId = 1 };
        var attempt = new StudentAttempt
        {
            Id = 1,
            UserId = 1,
            Status = AttemptStatus.InProgress,
            StartTime = DateTime.UtcNow.AddHours(-1),
            Exam = new Exam
            {
                Id = 1,
                Title = "Test Exam",
                SectionParts = new List<SectionPart>
            {
                new SectionPart
                {
                    Id = 1,
                    Title = "Section 1",
                    SectionType = SectionTypes.Reading
                }
            }
            },
            Answers = new List<Answer>
        {
            new Answer
            {
                Id = 1,
                QuestionId = 1,
                Question = new Question
                {
                    Id = 1,
                    QuestionText = "Test Question",
                    Section = new SectionPart
                    {
                        Id = 1,
                        Title = "Section 1",
                        SectionType = SectionTypes.Reading
                    }
                },
                Score = 1
            }
        }
        };

        var expectedResponse = new AttemptResultResponse
        {
            Id = 1,
            ExamTitle = "Test Exam",
            StartTime = attempt.StartTime,
            Answers = new List<AnswerResponse>
        {
            new AnswerResponse
            {
                Id = 1,
                QuestionId = 1,
                QuestionText = "Test Question",
                Score = 1,
                SectionType = SectionTypes.Reading
            }
        }
        };

        var mockScore = new VstepScore
        {
            FinalScore = 8.5m,
            SectionScores = new Dictionary<SectionTypes, SectionScore>
            {
                [SectionTypes.Reading] = new SectionScore
                {
                    Score = 8.5m,
                    DetailScores = new Dictionary<string, decimal>
                    {
                        ["Part 1"] = 8.5m
                    }
                }
            }
        };

        _mockUnitOfWork.Setup(x => x.StudentAttemptRepository.FindByIdAsync(
            It.IsAny<int>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(attempt);

        _mockUnitOfWork.Setup(x => x.StudentAttemptRepository.GetAttemptWithDetailsAsync(
            It.IsAny<int>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(attempt);

        _mockScoreCalculator.Setup(x => x.CalculateScoreAsync(
            It.IsAny<StudentAttempt>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(mockScore);

        _mockMapper.Setup(x => x.Map<List<AnswerResponse>>(It.IsAny<IEnumerable<Answer>>()))
            .Returns(expectedResponse.Answers);

        // Act
        var result = await _service.FinishAttemptAsync(
            request.UserId, request, CancellationToken.None);

        // Assert
        Assert.True(result.IsSuccess);
        Assert.Equal(expectedResponse.Id, result.Value.Id);
        Assert.Equal(expectedResponse.ExamTitle, result.Value.ExamTitle);
        Assert.Equal(expectedResponse.StartTime, result.Value.StartTime);
        Assert.NotNull(result.Value.EndTime);
        Assert.Single(result.Value.Answers);
        Assert.Equal(SectionTypes.Reading, result.Value.Answers[0].SectionType);
        Assert.Equal(mockScore.FinalScore, result.Value.FinalScore);
        Assert.Equal(mockScore.SectionScores[SectionTypes.Reading].Score,
            result.Value.SectionScores[SectionTypes.Reading]);

        _mockUnitOfWork.Verify(x => x.StudentAttemptRepository.Update(
            It.Is<StudentAttempt>(a =>
                a.Status == AttemptStatus.Completed &&
                a.EndTime.HasValue)),
            Times.Once);
        _mockUnitOfWork.Verify(x => x.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }
}