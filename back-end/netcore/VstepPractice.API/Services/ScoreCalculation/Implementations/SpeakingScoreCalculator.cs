using System.Text;
using VstepPractice.API.Common.Utils;
using VstepPractice.API.Models.DTOs.Scores;
using VstepPractice.API.Models.Entities;
using VstepPractice.API.Repositories.Interfaces;

namespace VstepPractice.API.Services.ScoreCalculation.Implementations;

public class SpeakingScoreCalculator : ISectionScoreCalculator
{
    private readonly ISpeakingAssessmentRepository _assessmentRepo;
    private readonly ILogger<SpeakingScoreCalculator> _logger;

    public SpeakingScoreCalculator(
        ISpeakingAssessmentRepository assessmentRepo,
        ILogger<SpeakingScoreCalculator> logger)
    {
        _assessmentRepo = assessmentRepo;
        _logger = logger;
    }

    public virtual async Task<SectionScore> CalculateScoreAsync(
        IEnumerable<Answer> answers,
        IEnumerable<Question> questions,
        CancellationToken cancellationToken = default)
    {
        try
        {
            // Group questions by parts
            var parts = questions
                .GroupBy(q => q.Passage)
                .OrderBy(g => g.Key.OrderNum)
                .ToList();

            if (!parts.Any())
            {
                _logger.LogWarning("No speaking parts found");
                return new SectionScore { Score = 0 };
            }

            var partScores = new List<PartScore>();
            decimal totalScore = 0;

            foreach (var part in parts)
            {
                var partQuestions = part.OrderBy(q => q.OrderNum).ToList();
                var questionScores = new List<(string QuestionText, decimal Score, string? Feedback)>();
                decimal partTotalScore = 0;
                var validAssessments = 0;

                // Calculate scores for each question in the part
                foreach (var question in partQuestions)
                {
                    var answer = answers.FirstOrDefault(a => a.QuestionId == question.Id);
                    if (answer == null) continue;

                    var assessment = await _assessmentRepo.GetByAnswerIdAsync(
                        answer.Id, cancellationToken);

                    if (assessment == null) continue;

                    var questionScore = assessment.TotalScore;
                    partTotalScore += questionScore;
                    validAssessments++;

                    questionScores.Add((
                        question.QuestionText ?? "Question",
                        questionScore,
                        assessment.DetailedFeedback));
                }

                // Calculate part average score
                var partAverageScore = validAssessments > 0
                    ? ScoreUtils.RoundToNearestHalf(partTotalScore / validAssessments)
                    : 0;

                partScores.Add(new PartScore
                {
                    PartTitle = part.Key.Title,
                    CorrectAnswers = validAssessments,
                    TotalQuestions = partQuestions.Count,
                    Score = partAverageScore
                });

                // Build detailed scores dictionary
                var detailScores = new Dictionary<string, decimal>();
                foreach (var (questionText, score, _) in questionScores)
                {
                    detailScores[$"{part.Key.Title} - {questionText}"] = score;
                }
                detailScores[$"{part.Key.Title} - Average"] = partAverageScore;

                totalScore += partAverageScore;
            }

            // Calculate final section score (average of all parts)
            var finalScore = ScoreUtils.RoundToNearestHalf(totalScore / parts.Count);

            return new SectionScore
            {
                Score = finalScore,
                DetailScores = partScores.ToDictionary(
                    p => p.PartTitle,
                    p => p.Score),
                Feedback = GenerateFeedback(partScores)
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error calculating speaking score");
            throw;
        }
    }

    private static string GenerateFeedback(List<PartScore> partScores)
    {
        var feedback = new StringBuilder();
        feedback.AppendLine("Speaking Score Breakdown:");

        foreach (var part in partScores)
        {
            feedback.AppendLine($"\n{part.PartTitle}:");
            feedback.AppendLine($"Score: {part.Score:F1}/10");
            feedback.AppendLine($"Completed: {part.CorrectAnswers}/{part.TotalQuestions} questions");
        }

        var totalScore = ScoreUtils.RoundToNearestHalf(
            partScores.Sum(p => p.Score) / partScores.Count);
        feedback.AppendLine($"\nFinal Speaking Score: {totalScore:F1}/10");

        if (partScores.Any(p => p.CorrectAnswers < p.TotalQuestions))
        {
            feedback.AppendLine("\nNote: Some questions are not yet assessed.");
        }

        return feedback.ToString();
    }
}