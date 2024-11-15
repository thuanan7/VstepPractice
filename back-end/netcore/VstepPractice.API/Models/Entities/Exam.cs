using System.ComponentModel.DataAnnotations.Schema;

namespace VstepPractice.API.Models.Entities;

public class Exam : BaseEntity
{
    [Column("title")]
    public string? Title { get; set; }
    [Column("description")]
    public string? Description { get; set; }
    [Column("userId")]
    public int CreatedById { get; set; }
    public virtual ICollection<SectionPart> Sections { get; set; } = default!;
    public virtual ICollection<StudentAttempt> StudentAttempts { get; set; } = default!;
}
