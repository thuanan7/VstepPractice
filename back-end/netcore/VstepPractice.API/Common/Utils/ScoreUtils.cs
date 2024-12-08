using VstepPractice.API.Models.DTOs.AI;

namespace VstepPractice.API.Common.Utils;

public static class ScoreUtils
{
    public static decimal RoundToNearestHalf(decimal score)
    {
        return Math.Round(score * 2, MidpointRounding.AwayFromZero) / 2;
    }

    public static decimal CalculateAverageScore(params decimal[] scores)
    {
        if (scores == null || scores.Length == 0)
            return 0;

        return RoundToNearestHalf(scores.Average());
    }

    public static decimal ConvertToScale10(int correct, int total)
    {
        if (total == 0) return 0;
        return RoundToNearestHalf((decimal)correct / total * 10);
    }

    public static class AssessmentScoreValidator
    {
        private const decimal MAX_CRITERION_SCORE = 2.5m;

        public static T ValidateAndNormalizeScores<T>(params (string name, decimal score)[] scores)
            where T : ISkillAssessmentResponse, new()
        {
            // Ensure each score is between 0 and 2.5
            var normalizedScores = scores.ToDictionary(
                s => s.name,
                s => Math.Min(Math.Max(s.score, 0), MAX_CRITERION_SCORE)
            );

            var response = new T();
            var properties = typeof(T).GetProperties()
                .Where(p => p.PropertyType == typeof(decimal) && p.CanWrite);

            foreach (var prop in properties)
            {
                if (normalizedScores.TryGetValue(prop.Name.ToLower(), out var score))
                {
                    prop.SetValue(response, score);
                }
            }

            return response;
        }
    }
}
