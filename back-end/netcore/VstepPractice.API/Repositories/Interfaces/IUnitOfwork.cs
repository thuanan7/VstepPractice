namespace VstepPractice.API.Repositories.Interfaces;

public interface IUnitOfWork : IDisposable
{
    IExamRepository ExamRepository { get; }
    IQuestionOptionRepository QuestionOptions { get; }
    IStudentAttemptRepository StudentAttemptRepository { get; }
    IAnswerRepository AnswerRepository { get; }
    IQuestionRepository QuestionRepository { get; }
    IWritingAssessmentRepository WritingAssessmentRepository { get; }
    ISpeakingAssessmentRepository SpeakingAssessmentRepository { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    Task BeginTransactionAsync(CancellationToken cancellationToken = default);
    Task CommitAsync(CancellationToken cancellationToken = default);
    Task RollbackAsync(CancellationToken cancellationToken = default);
}
