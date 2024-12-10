namespace VstepPractice.API.Models.DTOs.AI;
public class SpeakingAssessmentResponse : ISkillAssessmentResponse
{
    // Azure Pronunciation Assessment scores (0-100)
    public decimal PronScore { get; set; }
    public decimal AccuracyScore { get; set; }
    public decimal FluencyScore { get; set; }
    public decimal ProsodyScore { get; set; }

    // OpenAI Assessment scores (0-100)
    public decimal GrammarScore { get; set; }
    public decimal VocabularyScore { get; set; }
    public decimal TopicScore { get; set; }

    // Text content
    public string RecognizedText { get; set; } = string.Empty;
    public string DetailedFeedback { get; set; } = string.Empty;
    public string DetailedResultUrl { get; set; } = string.Empty;

    // Required by ISkillAssessmentResponse
    public decimal TotalScore => Math.Round(
        (PronScore + FluencyScore + VocabularyScore + GrammarScore) / 4 * 0.1m,
        1); // Convert 100-scale to 10-scale
}