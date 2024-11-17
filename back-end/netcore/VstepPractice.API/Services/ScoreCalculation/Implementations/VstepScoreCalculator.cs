using VstepPractice.API.Common.Enums;
using VstepPractice.API.Common.Utils;
using VstepPractice.API.Models.DTOs.Scores;
using VstepPractice.API.Models.Entities;

namespace VstepPractice.API.Services.ScoreCalculation.Implementations;

public class VstepScoreCalculator : IVstepScoreCalculator
{
    private readonly IEnumerable<ISectionScoreCalculator> _calculators;
    private readonly ILogger<VstepScoreCalculator> _logger;

    public VstepScoreCalculator(
        IEnumerable<ISectionScoreCalculator> calculators,
        ILogger<VstepScoreCalculator> logger)
    {
        _calculators = calculators;
        _logger = logger;
    }

    public async Task<VstepScore> CalculateScoreAsync(
        StudentAttempt attempt,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var sectionScores = new Dictionary<SectionTypes, SectionScore>();

            var sectionParts = attempt.Exam.SectionParts
                .GroupBy(s => s.SectionType)
                .ToDictionary(g => g.Key, g => g.ToList());

            foreach (var calculator in _calculators)
            {
                // Lấy type của calculator để biết nó xử lý section nào
                var sectionType = GetCalculatorSectionType(calculator);

                if (!sectionParts.ContainsKey(sectionType))
                    continue;

                var sections = sectionParts[sectionType];
                var questions = sections.SelectMany(s => s.Questions).ToList();

                if (!questions.Any())
                    continue;

                var score = await calculator.CalculateScoreAsync(
                    attempt.Answers,
                    questions,
                    cancellationToken);

                sectionScores[sectionType] = score;
            }

            var finalScore = ScoreUtils.CalculateAverageScore(
                sectionScores.Values.Select(s => s.Score).ToArray());

            return new VstepScore
            {
                FinalScore = finalScore,
                SectionScores = sectionScores
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex,
                "Error calculating VSTEP score for attempt {AttemptId}",
                attempt.Id);
            throw;
        }
    }

    private static SectionTypes GetCalculatorSectionType(ISectionScoreCalculator calculator)
    {
        return calculator switch
        {
            ListeningScoreCalculator => SectionTypes.Listening,
            AlternativeReadingScoreCalculator => SectionTypes.Reading,
            WritingScoreCalculator => SectionTypes.Writing,
            _ => throw new InvalidOperationException($"Unknown calculator type: {calculator.GetType().Name}")
        };
    }
}