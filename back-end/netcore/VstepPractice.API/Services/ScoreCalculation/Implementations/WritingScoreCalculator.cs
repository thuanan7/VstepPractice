using System.Text;
using VstepPractice.API.Common.Utils;
using VstepPractice.API.Models.DTOs.Scores;
using VstepPractice.API.Models.Entities;
using VstepPractice.API.Repositories.Interfaces;

namespace VstepPractice.API.Services.ScoreCalculation.Implementations;

public class WritingScoreCalculator : ISectionScoreCalculator
{
    private readonly IWritingAssessmentRepository _assessmentRepo;
    private readonly ILogger<WritingScoreCalculator> _logger;

    public WritingScoreCalculator(
        IWritingAssessmentRepository assessmentRepo,
        ILogger<WritingScoreCalculator> logger)
    {
        _assessmentRepo = assessmentRepo;
        _logger = logger;
    }

    public async Task<SectionScore> CalculateScoreAsync(
        IEnumerable<Answer> answers,
        IEnumerable<Question> questions,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var writingTasks = questions
                .OrderBy(q => q.OrderNum)
                .ToList();

            if (!writingTasks.Any())
                return new SectionScore { Score = 0 };

            var taskScores = new List<(string Title, WritingAssessment Assessment)>();
            decimal totalScore = 0;

            foreach (var task in writingTasks)
            {
                var answer = answers.FirstOrDefault(a => a.QuestionId == task.Id);
                if (answer == null) continue;

                var assessment = await _assessmentRepo.GetByAnswerIdAsync(
                    answer.Id, cancellationToken);

                if (assessment == null) continue;

                taskScores.Add((task.Section.Title, assessment));
            }

            if (taskScores.Count != writingTasks.Count)
            {
                _logger.LogWarning(
                    "Not all writing tasks have been assessed. Expected: {Expected}, Found: {Found}",
                    writingTasks.Count, taskScores.Count);
                return new SectionScore { Score = 0 };
            }

            // Calculate score according to formula: (Task1 + (Task2 x 2))/3
            var task1Score = taskScores[0].Assessment.TotalScore;
            var task2Score = taskScores[1].Assessment.TotalScore;
            totalScore = (task1Score + (task2Score * 2)) / 3;

            var detailScores = new Dictionary<string, decimal>();

            foreach (var (title, assessment) in taskScores)
            {
                detailScores[$"{title} - Task Achievement"] = assessment.TaskAchievement;
                detailScores[$"{title} - Coherence & Cohesion"] = assessment.CoherenceCohesion;
                detailScores[$"{title} - Lexical Resource"] = assessment.LexicalResource;
                detailScores[$"{title} - Grammar Accuracy"] = assessment.GrammarAccuracy;
                detailScores[$"{title} - Total"] = assessment.TotalScore;
            }

            return new SectionScore
            {
                Score = ScoreUtils.RoundToNearestHalf(totalScore),
                DetailScores = detailScores,
                Feedback = GenerateFeedback(taskScores)
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error calculating writing score");
            throw;
        }
    }

    private static string GenerateFeedback(
        List<(string Title, WritingAssessment Assessment)> taskScores)
    {
        var feedback = new StringBuilder();
        feedback.AppendLine("Writing Score Breakdown:");

        foreach (var (title, assessment) in taskScores)
        {
            feedback.AppendLine($"\n{title}:");
            feedback.AppendLine($"- Task Achievement: {assessment.TaskAchievement:F2}/2.5");
            feedback.AppendLine($"- Coherence & Cohesion: {assessment.CoherenceCohesion:F2}/2.5");
            feedback.AppendLine($"- Lexical Resource: {assessment.LexicalResource:F2}/2.5");
            feedback.AppendLine($"- Grammar Accuracy: {assessment.GrammarAccuracy:F2}/2.5");
            feedback.AppendLine($"- Total: {assessment.TotalScore:F2}/10");
            feedback.AppendLine("\nDetailed Feedback:");
            feedback.AppendLine(assessment.DetailedFeedback);
        }

        return feedback.ToString();
    }
}