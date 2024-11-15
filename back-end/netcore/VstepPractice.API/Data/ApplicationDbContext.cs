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

        // Configure Identity tables

        // Exam -> Section relationship
        builder.Entity<SectionPart>()
            .HasOne(s => s.Exam)
            .WithMany(e => e.Sections)
            .HasForeignKey(s => s.ExamId)
            .OnDelete(DeleteBehavior.Cascade);

        // Question -> QuestionOption relationship
        builder.Entity<QuestionOption>()
            .HasOne(o => o.Question)
            .WithMany(q => q.Options)
            .HasForeignKey(o => o.QuestionId)
            .OnDelete(DeleteBehavior.Cascade);


        builder.Entity<StudentAttempt>()
            .HasOne(sa => sa.Exam)
            .WithMany(e => e.StudentAttempts)
            .HasForeignKey(sa => sa.ExamId)
            .OnDelete(DeleteBehavior.Restrict);

        // Answer relationships
        builder.Entity<Answer>()
            .HasOne(a => a.Attempt)
            .WithMany(sa => sa.Answers)
            .HasForeignKey(a => a.AttemptId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<Answer>()
            .HasOne(a => a.Question)
            .WithMany()
            .HasForeignKey(a => a.QuestionId)
            .OnDelete(DeleteBehavior.Restrict);

        // Update Answer configuration to make SelectedOptionId optional
        builder.Entity<Answer>()
            .HasOne(a => a.SelectedOption)
            .WithMany()
            .HasForeignKey(a => a.SelectedOptionId)
            .IsRequired(false)  // Make the relationship optional
            .OnDelete(DeleteBehavior.Restrict);

        // Configure StudentAttempt relationships
        builder.Entity<StudentAttempt>(entity =>
        {

            entity.HasOne(a => a.Exam)
                .WithMany(e => e.StudentAttempts)
                .HasForeignKey(a => a.ExamId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.Property(e => e.Status)
                .HasDefaultValue(AttemptStatus.InProgress);
        });

        // WritingAssessment configuration
        builder.Entity<WritingAssessment>(entity =>
        {
            entity.ToTable("WritingAssessments");

            entity.HasKey(e => e.Id);

            entity.Property(e => e.TaskAchievement)
                .HasPrecision(4, 2)
                .IsRequired();

            entity.Property(e => e.CoherenceCohesion)
                .HasPrecision(4, 2)
                .IsRequired();

            entity.Property(e => e.LexicalResource)
                .HasPrecision(4, 2)
                .IsRequired();

            entity.Property(e => e.GrammarAccuracy)
                .HasPrecision(4, 2)
                .IsRequired();

            entity.Property(e => e.DetailedFeedback)
                .IsRequired();

            entity.Property(e => e.AssessedAt)
                .IsRequired();

            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .IsRequired();

            entity.HasOne(w => w.Answer)
                .WithOne()
                .HasForeignKey<WritingAssessment>(w => w.AnswerId)
                .OnDelete(DeleteBehavior.Cascade);
        });

    }
}