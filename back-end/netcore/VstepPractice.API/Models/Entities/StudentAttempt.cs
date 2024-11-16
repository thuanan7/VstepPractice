using System.ComponentModel.DataAnnotations.Schema;
using VstepPractice.API.Common.Enums;

namespace VstepPractice.API.Models.Entities;

public class StudentAttempt : BaseEntity
{
    [Column("userId")]
    public int UserId { get; set; }
    [Column("examId")]
    public int ExamId { get; set; }
    [Column("startTime")]
    public DateTime StartTime { get; set; } = DateTime.UtcNow;
    [Column("endTime")]
    public DateTime? EndTime { get; set; }
    [Column("status")]
    public AttemptStatus Status { get; set; } = AttemptStatus.InProgress;
    // Navigation properties
    [ForeignKey("examId")]
    public virtual Exam Exam { get; set; } = default!;
    [ForeignKey("userId")]
    public virtual User User { get; set; } = default!;
    public virtual ICollection<Answer> Answers { get; set; } = default!;
}