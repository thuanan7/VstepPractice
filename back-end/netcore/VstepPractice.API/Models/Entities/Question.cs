using System.ComponentModel.DataAnnotations.Schema;

namespace VstepPractice.API.Models.Entities;

public class Question : BaseEntity
{
    [Column("sectionId")]
    public int SectionId { get; set; }
    [Column("questionText")]
    public string? QuestionText { get; set; } = "";
    [Column("point")]
    public decimal Point { get; set; } = 1;
    [Column("orderNum")]
    public int OrderNum { get; set; }
    
    // Navigation properties
    [ForeignKey(nameof(SectionId))]
    public virtual SectionPart Passage { get; set; } = default!;
    public virtual ICollection<QuestionOption> Options { get; set; } = new List<QuestionOption>();
}