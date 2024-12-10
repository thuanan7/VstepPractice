using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace VstepPractice.API.Models.Entities;

public class SpeakingAssessment : BaseEntity
{
    [Column("answerId")]
    public int AnswerId { get; set; }

    // Core pronunciation scores from Azure (0-100)
    [Column("pronunciation", TypeName = "decimal(5,2)")]
    public decimal Pronunciation { get; set; }  // Overall pronunciation score

    [Column("fluency", TypeName = "decimal(5,2)")]
    public decimal Fluency { get; set; }  // Speech fluency/smoothness

    [Column("accuracy", TypeName = "decimal(5,2)")]
    public decimal AccuracyScore { get; set; }  // Pronunciation accuracy

    [Column("prosody", TypeName = "decimal(5,2)")]
    public decimal ProsodyScore { get; set; }  // Intonation and stress patterns

    // Content assessment scores from Azure (0-100)
    [Column("vocabulary", TypeName = "decimal(5,2)")]
    public decimal Vocabulary { get; set; }  // Vocabulary usage score

    [Column("grammar", TypeName = "decimal(5,2)")]
    public decimal Grammar { get; set; }  // Grammar accuracy

    [Column("topicScore", TypeName = "decimal(5,2)")]
    public decimal TopicScore { get; set; }  // Topic relevance score

    // Feedback and text content
    [Column("detailedFeedback")]
    public string DetailedFeedback { get; set; } = string.Empty;  // Generated comprehensive feedback

    [Column("transcribedText")]
    public string TranscribedText { get; set; } = string.Empty;  // Recognized speech text

    // URLs for associated files
    [Column("audioUrl")]
    [StringLength(255)]
    public string AudioUrl { get; set; } = string.Empty;  // URL to audio recording

    [Column("detailedResultUrl")]
    [StringLength(255)]
    public string DetailedResultUrl { get; set; } = string.Empty;  // URL to detailed JSON assessment

    [Column("assessedAt")]
    public DateTime AssessedAt { get; set; } = DateTime.UtcNow;

    // Calculated total score (0-10 scale for VSTEP compatibility)
    [NotMapped]
    public decimal TotalScore => Math.Round(
        (Pronunciation + Fluency + Vocabulary + Grammar) / 4 * 0.1m,
        1);  // Convert 100-scale to 10-scale

    // Navigation property
    [ForeignKey(nameof(AnswerId))]
    public virtual Answer Answer { get; set; } = default!;
}