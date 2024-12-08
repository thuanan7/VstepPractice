namespace VstepPractice.API.Models.DTOs.AI;

public class SpeakingAssessmentResponse : ISkillAssessmentResponse
{
    public decimal Pronunciation { get; set; }
    public decimal Fluency { get; set; }
    public decimal Vocabulary { get; set; }
    public decimal Grammar { get; set; }
    public string DetailedFeedback { get; set; } = string.Empty;

    public decimal TotalScore => Math.Round(
        (Pronunciation + Fluency + Vocabulary + Grammar), 1);
}