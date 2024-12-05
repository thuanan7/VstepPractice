using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace VstepPractice.API.Models.Entities;

public class SpeakingAssessment : BaseEntity
{
    [Column("answerId")]
    public int AnswerId { get; set; }

    [Column("pronunciation", TypeName = "decimal(4,2)")]
    public decimal Pronunciation { get; set; }

    [Column("fluency", TypeName = "decimal(4,2)")]
    public decimal Fluency { get; set; }

    [Column("vocabulary", TypeName = "decimal(4,2)")]
    public decimal Vocabulary { get; set; }

    [Column("grammar", TypeName = "decimal(4,2)")]
    public decimal Grammar { get; set; }

    [Column("detailedFeedback")]
    public string DetailedFeedback { get; set; } = string.Empty;

    [Column("transcribedText")]
    public string TranscribedText { get; set; } = string.Empty;

    [Column("audioUrl")]
    [StringLength(255)]
    public string AudioUrl { get; set; } = string.Empty;

    [Column("assessedAt")]
    public DateTime AssessedAt { get; set; } = DateTime.UtcNow;

    [NotMapped]
    public decimal TotalScore => Math.Round(
        (Pronunciation + Fluency + Vocabulary + Grammar), 1);

    [ForeignKey(nameof(AnswerId))]
    public virtual Answer Answer { get; set; } = default!;
}
