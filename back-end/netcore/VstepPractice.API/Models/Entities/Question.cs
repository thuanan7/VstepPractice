using System.ComponentModel.DataAnnotations.Schema;
using VstepPractice.API.Common.Enums;

namespace VstepPractice.API.Models.Entities;

public class Question : BaseEntity
{
    [Column("sectionId")]
    public int sectionId { get; set; }
    [Column("questionText")]
    public string? QuestionText { get; set; } = "";
    [Column("point")]
    public int Point { get; set; } = 1;
    [Column("orderNum")]
    public int OrderNum { get; set; }
    
    // Navigation properties
    [ForeignKey(nameof(sectionId))]
    public virtual SectionPart Section { get; set; } = default!;
    public virtual ICollection<QuestionOption> Options { get; set; } = new List<QuestionOption>();
}