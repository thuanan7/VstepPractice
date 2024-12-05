using System.Text;
using VstepPractice.API.Common.Utils;
using VstepPractice.API.Models.DTOs.Scores;
using VstepPractice.API.Models.Entities;

namespace VstepPractice.API.Services.ScoreCalculation.Implementations;

public class ListeningScoreCalculator : ISectionScoreCalculator
{
    private readonly ILogger<ListeningScoreCalculator> _logger;

    public ListeningScoreCalculator(ILogger<ListeningScoreCalculator> logger)
    {
        _logger = logger;
    }

    public virtual async Task<SectionScore> CalculateScoreAsync(
        IEnumerable<Answer> answers,
        IEnumerable<Question> questions,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var parts = questions
                .GroupBy(q => q.Passage)
                .OrderBy(g => g.Key.OrderNum)
                .ToList();

            var partScores = new List<PartScore>();
            var totalCorrect = 0;
            var totalQuestions = 0;
            var hasMissingAnswers = false;

            foreach (var part in parts)
            {
                var partQuestions = part.OrderBy(q => q.OrderNum).ToList();
                var partAnswers = answers
                    .Where(a => partQuestions.Select(q => q.Id).Contains(a.QuestionId))
                    .ToList();

                // Check for missing answers
                if (partAnswers.Count < partQuestions.Count)
                {
                    hasMissingAnswers = true;
                    _logger.LogWarning(
                        "Missing answers for part {PartTitle}. Expected: {Expected}, Found: {Found}",
                        part.Key.Title, partQuestions.Count, partAnswers.Count);
                }

                var correctCount = partAnswers.Count(a =>
                    a.SelectedOption != null && a.SelectedOption.IsCorrect);

                partScores.Add(new PartScore
                {
                    PartTitle = part.Key.Title,
                    CorrectAnswers = correctCount,
                    TotalQuestions = partQuestions.Count,
                    Score = correctCount // Each correct answer = 1 point
                });

                totalCorrect += correctCount;
                totalQuestions += partQuestions.Count;
            }

            // Convert to scale of 10
            var finalScore = ScoreUtils.ConvertToScale10(totalCorrect, totalQuestions);

            return new SectionScore
            {
                Score = finalScore,
                DetailScores = partScores.ToDictionary(
                    p => p.PartTitle,
                    p => p.Score),
                Feedback = GenerateFeedback(partScores, hasMissingAnswers)
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error calculating listening score");
            throw;
        }
    }

    private static string GenerateFeedback(List<PartScore> partScores, bool hasMissingAnswers)
    {
        var feedback = new StringBuilder();
        feedback.AppendLine("Listening Score Breakdown:");

        foreach (var part in partScores)
        {
            feedback.AppendLine($"- {part.PartTitle}: {part.CorrectAnswers}/{part.TotalQuestions} correct");
        }

        var totalCorrect = partScores.Sum(p => p.CorrectAnswers);
        var totalQuestions = partScores.Sum(p => p.TotalQuestions);
        feedback.AppendLine($"Total: {totalCorrect}/{totalQuestions} correct");

        if (hasMissingAnswers)
        {
            feedback.AppendLine("\nWarning: Missing answers detected. This may affect your final score.");
        }

        return feedback.ToString();
    }
}
