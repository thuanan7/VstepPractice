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
                .HasForeignKey(e => e.userId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasMany(u => u.StudentAttempts)
                .WithOne(sa => sa.User)
                .HasForeignKey(sa => sa.UserId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // Exam configuration
        builder.Entity<Exam>(entity =>
        {
            entity.ToTable("Exams");

            entity.HasMany(e => e.SectionParts)
                .WithOne(s => s.Exam)
                .HasForeignKey(s => s.ExamId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasMany(e => e.StudentAttempts)
                .WithOne(sa => sa.Exam)
                .HasForeignKey(sa => sa.ExamId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // SectionPart configuration
        builder.Entity<SectionPart>(entity =>
        {
            entity.ToTable("SelectionParts");

            // Self-referencing relationship
            entity.HasOne(s => s.Parent)
                .WithMany(s => s.Children)
                .HasForeignKey(s => s.ParentId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasMany(s => s.Questions)
                .WithOne(q => q.Section)
                .HasForeignKey(q => q.sectionId)
                .OnDelete(DeleteBehavior.Cascade);

            // Configure string-based Type
            entity.Property(s => s.Type)
                .HasMaxLength(50)
                .IsRequired();
        });

        // Question configuration
        builder.Entity<Question>(entity =>
        {
            entity.ToTable("Questions");

            entity.HasMany(q => q.Options)
                .WithOne(o => o.Question)
                .HasForeignKey(o => o.QuestionId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // QuestionOption configuration
        builder.Entity<QuestionOption>(entity =>
        {
            entity.ToTable("QuestionOptions");
        });

        // StudentAttempt configuration
        builder.Entity<StudentAttempt>(entity =>
        {
            entity.ToTable("StudentAttempts");

            entity.Property(e => e.Status)
                .HasConversion<string>()
                .HasMaxLength(20)
                .HasDefaultValue(AttemptStatus.InProgress);

            entity.HasMany(sa => sa.Answers)
                .WithOne(a => a.Attempt)
                .HasForeignKey(a => a.AttemptId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Answer configuration
        builder.Entity<Answer>(entity =>
        {
            entity.ToTable("Answers");

            entity.HasOne(a => a.Question)
                .WithMany()
                .HasForeignKey(a => a.QuestionId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(a => a.SelectedOption)
                .WithMany()
                .HasForeignKey(a => a.QuestionOptionId)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // WritingAssessment configuration
        builder.Entity<WritingAssessment>(entity =>
        {
            entity.ToTable("WritingAssessments");

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