namespace VstepPractice.API.Models.DTOs.StudentAttempts.Responses;

public class SpeakingScoreDetails
{
    public decimal Pronunciation { get; set; }
    public decimal Fluency { get; set; }
    public decimal Vocabulary { get; set; }
    public decimal Grammar { get; set; }
    public string AudioUrl { get; set; } = string.Empty;
    public string TranscribedText { get; set; } = string.Empty;
    public decimal TotalScore =>
        Math.Round((Pronunciation + Fluency + Vocabulary + Grammar), 1);
}