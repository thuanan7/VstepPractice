using Microsoft.EntityFrameworkCore;
using VstepPractice.API.Common.Enums;
using VstepPractice.API.Models.Entities;

namespace VstepPractice.API.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<Exam> Exams { get; set; }
    public DbSet<SectionPart> SectionParts { get; set; }
    public DbSet<Question> Questions { get; set; }
    public DbSet<QuestionOption> QuestionOptions { get; set; }
    public DbSet<StudentAttempt> StudentAttempts { get; set; }
    public DbSet<Answer> Answers { get; set; }
    public DbSet<WritingAssessment> WritingAssessments { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // User configuration
        builder.Entity<User>(entity =>
        {
            entity.ToTable("Users");

            entity.HasMany(u => u.CreatedExams)
                .WithOne(e => e.CreatedBy)
                .HasForeignKey(e => e.userId);

            entity.HasMany(u => u.StudentAttempts)
                .WithOne(sa => sa.User)
                .HasForeignKey(sa => sa.UserId);
        });

        // Exam configuration
        builder.Entity<Exam>(entity =>
        {
            entity.ToTable("Exams");

            entity.HasMany(e => e.SectionParts)
                .WithOne(s => s.Exam)
                .HasForeignKey(s => s.ExamId);

            entity.HasMany(e => e.StudentAttempts)
                .WithOne(sa => sa.Exam)
                .HasForeignKey(sa => sa.ExamId);
        });

        // StudentAttempt configuration
        builder.Entity<StudentAttempt>(entity =>
        {
            entity.ToTable("StudentAttempts");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.UserId).HasColumnName("userId");
            entity.Property(e => e.ExamId).HasColumnName("examId");
            entity.Property(e => e.StartTime).HasColumnName("startTime");
            entity.Property(e => e.EndTime).HasColumnName("endTime");
            entity.Property(e => e.CreatedAt).HasColumnName("createdAt");
            entity.Property(e => e.UpdateAt).HasColumnName("updatedAt");

            entity.Property(e => e.Status)
                .HasColumnName("status")
                .HasColumnType("integer")
                .HasDefaultValue(AttemptStatus.InProgress);

            // Define relationships without duplicate FKs
            entity.HasOne(sa => sa.User)
                .WithMany(u => u.StudentAttempts)
                .HasForeignKey(sa => sa.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(sa => sa.Exam)
                .WithMany(e => e.StudentAttempts)
                .HasForeignKey(sa => sa.ExamId)
                .OnDelete(DeleteBehavior.Restrict);
        });
    }
}