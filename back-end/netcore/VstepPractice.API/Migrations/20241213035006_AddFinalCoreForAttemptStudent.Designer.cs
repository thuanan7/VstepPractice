﻿// <auto-generated />
using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;
using VstepPractice.API.Data;
using VstepPractice.API.Models.Entities;

#nullable disable

namespace VstepPractice.API.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    [Migration("20241213035006_AddFinalCoreForAttemptStudent")]
    partial class AddFinalCoreForAttemptStudent
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.10")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("VstepPractice.API.Models.Entities.Answer", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .HasColumnName("id");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<string>("AiFeedback")
                        .HasColumnType("text")
                        .HasColumnName("aiFeedback");

                    b.Property<int>("AttemptId")
                        .HasColumnType("integer")
                        .HasColumnName("attemptId");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp without time zone")
                        .HasColumnName("createdAt");

                    b.Property<string>("EssayAnswer")
                        .HasColumnType("text")
                        .HasColumnName("essayAnswer");

                    b.Property<int>("QuestionId")
                        .HasColumnType("integer")
                        .HasColumnName("questionId");

                    b.Property<int?>("QuestionOptionId")
                        .HasColumnType("integer")
                        .HasColumnName("questionOptionId");

                    b.Property<decimal?>("Score")
                        .HasColumnType("numeric")
                        .HasColumnName("score");

                    b.Property<DateTime>("UpdateAt")
                        .HasColumnType("timestamp without time zone")
                        .HasColumnName("updatedAt");

                    b.HasKey("Id");

                    b.HasIndex("AttemptId");

                    b.HasIndex("QuestionId");

                    b.HasIndex("QuestionOptionId");

                    b.ToTable("Answers", (string)null);
                });

            modelBuilder.Entity("VstepPractice.API.Models.Entities.Exam", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .HasColumnName("id");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp without time zone")
                        .HasColumnName("createdAt");

                    b.Property<string>("Description")
                        .HasMaxLength(255)
                        .HasColumnType("character varying(255)")
                        .HasColumnName("description");

                    b.Property<string>("Title")
                        .HasMaxLength(255)
                        .HasColumnType("character varying(255)")
                        .HasColumnName("title");

                    b.Property<DateTime>("UpdateAt")
                        .HasColumnType("timestamp without time zone")
                        .HasColumnName("updatedAt");

                    b.Property<int>("UserId")
                        .HasColumnType("integer")
                        .HasColumnName("userId");

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.ToTable("Exams", (string)null);
                });

            modelBuilder.Entity("VstepPractice.API.Models.Entities.Question", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .HasColumnName("id");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp without time zone")
                        .HasColumnName("createdAt");

                    b.Property<int>("OrderNum")
                        .HasColumnType("integer")
                        .HasColumnName("orderNum");

                    b.Property<int>("PassageId")
                        .HasColumnType("integer")
                        .HasColumnName("passageId");

                    b.Property<decimal>("Point")
                        .HasColumnType("numeric")
                        .HasColumnName("point");

                    b.Property<string>("QuestionText")
                        .HasColumnType("text")
                        .HasColumnName("questionText");

                    b.Property<DateTime>("UpdateAt")
                        .HasColumnType("timestamp without time zone")
                        .HasColumnName("updatedAt");

                    b.HasKey("Id");

                    b.HasIndex("PassageId");

                    b.ToTable("Questions", (string)null);
                });

            modelBuilder.Entity("VstepPractice.API.Models.Entities.QuestionOption", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .HasColumnName("id");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<string>("Content")
                        .HasColumnType("text")
                        .HasColumnName("content");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp without time zone")
                        .HasColumnName("createdAt");

                    b.Property<bool>("IsCorrect")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("boolean")
                        .HasDefaultValue(false)
                        .HasColumnName("isCorrect");

                    b.Property<int>("OrderNum")
                        .HasColumnType("integer")
                        .HasColumnName("orderNum");

                    b.Property<int>("QuestionId")
                        .HasColumnType("integer")
                        .HasColumnName("questionId");

                    b.Property<DateTime>("UpdateAt")
                        .HasColumnType("timestamp without time zone")
                        .HasColumnName("updatedAt");

                    b.HasKey("Id");

                    b.HasIndex("QuestionId");

                    b.ToTable("QuestionOptions", (string)null);
                });

            modelBuilder.Entity("VstepPractice.API.Models.Entities.SectionPart", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .HasColumnName("id");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<string>("Content")
                        .HasColumnType("text")
                        .HasColumnName("content");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp without time zone")
                        .HasColumnName("createdAt");

                    b.Property<int>("ExamId")
                        .HasColumnType("integer")
                        .HasColumnName("examId");

                    b.Property<string>("Instructions")
                        .HasColumnType("text")
                        .HasColumnName("instructions");

                    b.Property<int>("OrderNum")
                        .HasColumnType("integer")
                        .HasColumnName("orderNum");

                    b.Property<int?>("ParentId")
                        .HasColumnType("integer")
                        .HasColumnName("parentId");

                    b.Property<int>("SectionType")
                        .HasColumnType("integer")
                        .HasColumnName("sectionType");

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasMaxLength(255)
                        .HasColumnType("character varying(255)")
                        .HasColumnName("title");

                    b.Property<int>("Type")
                        .HasColumnType("integer")
                        .HasColumnName("type");

                    b.Property<DateTime>("UpdateAt")
                        .HasColumnType("timestamp without time zone")
                        .HasColumnName("updatedAt");

                    b.HasKey("Id");

                    b.HasIndex("ExamId");

                    b.HasIndex("ParentId");

                    b.ToTable("SectionParts", (string)null);
                });

            modelBuilder.Entity("VstepPractice.API.Models.Entities.SpeakingAssessment", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .HasColumnName("id");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<decimal>("Accuracy")
                        .HasColumnType("decimal(4,2)")
                        .HasColumnName("accuracy");

                    b.Property<int>("AnswerId")
                        .HasColumnType("integer")
                        .HasColumnName("answerId");

                    b.Property<DateTime>("AssessedAt")
                        .HasColumnType("timestamp without time zone")
                        .HasColumnName("assessedAt");

                    b.Property<string>("AudioUrl")
                        .IsRequired()
                        .HasMaxLength(255)
                        .HasColumnType("character varying(255)")
                        .HasColumnName("audioUrl");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp without time zone")
                        .HasColumnName("createdAt");

                    b.Property<string>("DetailedFeedback")
                        .IsRequired()
                        .HasColumnType("text")
                        .HasColumnName("detailedFeedback");

                    b.Property<decimal>("Fluency")
                        .HasColumnType("decimal(4,2)")
                        .HasColumnName("fluency");

                    b.Property<decimal>("Grammar")
                        .HasColumnType("decimal(4,2)")
                        .HasColumnName("grammar");

                    b.Property<decimal>("Pronunciation")
                        .HasColumnType("decimal(4,2)")
                        .HasColumnName("pronunciation");

                    b.Property<decimal>("Prosody")
                        .HasColumnType("decimal(4,2)")
                        .HasColumnName("prosody");

                    b.Property<decimal>("TopicScore")
                        .HasColumnType("decimal(4,2)")
                        .HasColumnName("topicScore");

                    b.Property<string>("TranscribedText")
                        .IsRequired()
                        .HasColumnType("text")
                        .HasColumnName("transcribedText");

                    b.Property<DateTime>("UpdateAt")
                        .HasColumnType("timestamp without time zone")
                        .HasColumnName("updatedAt");

                    b.Property<decimal>("Vocabulary")
                        .HasColumnType("decimal(4,2)")
                        .HasColumnName("vocabulary");

                    b.Property<List<WordDetail>>("WordDetails")
                        .HasColumnType("jsonb")
                        .HasColumnName("wordDetails");

                    b.HasKey("Id");

                    b.HasIndex("AnswerId");

                    b.ToTable("SpeakingAssessments", (string)null);
                });

            modelBuilder.Entity("VstepPractice.API.Models.Entities.StudentAttempt", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .HasColumnName("id");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp without time zone")
                        .HasColumnName("createdAt");

                    b.Property<DateTime?>("EndTime")
                        .HasColumnType("timestamp without time zone")
                        .HasColumnName("endTime");

                    b.Property<int>("ExamId")
                        .HasColumnType("integer")
                        .HasColumnName("examId");

                    b.Property<decimal>("FinalCore")
                        .HasColumnType("decimal(4,2)")
                        .HasColumnName("finalCore");

                    b.Property<DateTime>("StartTime")
                        .HasColumnType("timestamp without time zone")
                        .HasColumnName("startTime");

                    b.Property<int?>("Status")
                        .HasColumnType("integer")
                        .HasColumnName("status");

                    b.Property<DateTime>("UpdateAt")
                        .HasColumnType("timestamp without time zone")
                        .HasColumnName("updatedAt");

                    b.Property<int>("UserId")
                        .HasColumnType("integer")
                        .HasColumnName("userId");

                    b.HasKey("Id");

                    b.HasIndex("ExamId");

                    b.HasIndex("UserId");

                    b.ToTable("StudentAttempts", (string)null);
                });

            modelBuilder.Entity("VstepPractice.API.Models.Entities.User", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .HasColumnName("id");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp without time zone")
                        .HasColumnName("createdAt");

                    b.Property<string>("Email")
                        .HasMaxLength(255)
                        .HasColumnType("character varying(255)")
                        .HasColumnName("email");

                    b.Property<string>("FirstName")
                        .HasMaxLength(255)
                        .HasColumnType("character varying(255)")
                        .HasColumnName("firstName");

                    b.Property<string>("LastName")
                        .HasMaxLength(255)
                        .HasColumnType("character varying(255)")
                        .HasColumnName("lastName");

                    b.Property<string>("Password")
                        .HasMaxLength(255)
                        .HasColumnType("character varying(255)")
                        .HasColumnName("password");

                    b.Property<int>("Role")
                        .HasColumnType("integer")
                        .HasColumnName("role");

                    b.Property<DateTime>("UpdateAt")
                        .HasColumnType("timestamp without time zone")
                        .HasColumnName("updatedAt");

                    b.HasKey("Id");

                    b.ToTable("Users", (string)null);
                });

            modelBuilder.Entity("VstepPractice.API.Models.Entities.WritingAssessment", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .HasColumnName("id");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<int>("AnswerId")
                        .HasColumnType("integer")
                        .HasColumnName("answerId");

                    b.Property<DateTime>("AssessedAt")
                        .HasColumnType("timestamp without time zone")
                        .HasColumnName("assessedAt");

                    b.Property<decimal>("CoherenceCohesion")
                        .HasColumnType("decimal(4,2)")
                        .HasColumnName("coherenceCohesion");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp without time zone")
                        .HasColumnName("createdAt");

                    b.Property<string>("DetailedFeedback")
                        .IsRequired()
                        .HasColumnType("text")
                        .HasColumnName("detailedFeedback");

                    b.Property<decimal>("GrammarAccuracy")
                        .HasColumnType("decimal(4,2)")
                        .HasColumnName("grammarAccuracy");

                    b.Property<decimal>("LexicalResource")
                        .HasColumnType("decimal(4,2)")
                        .HasColumnName("lexicalResource");

                    b.Property<decimal>("TaskAchievement")
                        .HasColumnType("decimal(4,2)")
                        .HasColumnName("taskAchievement");

                    b.Property<DateTime>("UpdateAt")
                        .HasColumnType("timestamp without time zone")
                        .HasColumnName("updatedAt");

                    b.HasKey("Id");

                    b.HasIndex("AnswerId");

                    b.ToTable("WritingAssessments", (string)null);
                });

            modelBuilder.Entity("VstepPractice.API.Models.Entities.Answer", b =>
                {
                    b.HasOne("VstepPractice.API.Models.Entities.StudentAttempt", "Attempt")
                        .WithMany("Answers")
                        .HasForeignKey("AttemptId")
                        .OnDelete(DeleteBehavior.SetNull)
                        .IsRequired();

                    b.HasOne("VstepPractice.API.Models.Entities.Question", "Question")
                        .WithMany()
                        .HasForeignKey("QuestionId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("VstepPractice.API.Models.Entities.QuestionOption", "SelectedOption")
                        .WithMany()
                        .HasForeignKey("QuestionOptionId")
                        .OnDelete(DeleteBehavior.SetNull);

                    b.Navigation("Attempt");

                    b.Navigation("Question");

                    b.Navigation("SelectedOption");
                });

            modelBuilder.Entity("VstepPractice.API.Models.Entities.Exam", b =>
                {
                    b.HasOne("VstepPractice.API.Models.Entities.User", "CreatedBy")
                        .WithMany("CreatedExams")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.SetNull)
                        .IsRequired();

                    b.Navigation("CreatedBy");
                });

            modelBuilder.Entity("VstepPractice.API.Models.Entities.Question", b =>
                {
                    b.HasOne("VstepPractice.API.Models.Entities.SectionPart", "Passage")
                        .WithMany("Questions")
                        .HasForeignKey("PassageId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Passage");
                });

            modelBuilder.Entity("VstepPractice.API.Models.Entities.QuestionOption", b =>
                {
                    b.HasOne("VstepPractice.API.Models.Entities.Question", "Question")
                        .WithMany("Options")
                        .HasForeignKey("QuestionId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Question");
                });

            modelBuilder.Entity("VstepPractice.API.Models.Entities.SectionPart", b =>
                {
                    b.HasOne("VstepPractice.API.Models.Entities.Exam", "Exam")
                        .WithMany("SectionParts")
                        .HasForeignKey("ExamId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("VstepPractice.API.Models.Entities.SectionPart", "Parent")
                        .WithMany("Children")
                        .HasForeignKey("ParentId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.Navigation("Exam");

                    b.Navigation("Parent");
                });

            modelBuilder.Entity("VstepPractice.API.Models.Entities.SpeakingAssessment", b =>
                {
                    b.HasOne("VstepPractice.API.Models.Entities.Answer", "Answer")
                        .WithMany()
                        .HasForeignKey("AnswerId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Answer");
                });

            modelBuilder.Entity("VstepPractice.API.Models.Entities.StudentAttempt", b =>
                {
                    b.HasOne("VstepPractice.API.Models.Entities.Exam", "Exam")
                        .WithMany("StudentAttempts")
                        .HasForeignKey("ExamId")
                        .OnDelete(DeleteBehavior.SetNull)
                        .IsRequired();

                    b.HasOne("VstepPractice.API.Models.Entities.User", "User")
                        .WithMany("StudentAttempts")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.SetNull)
                        .IsRequired();

                    b.Navigation("Exam");

                    b.Navigation("User");
                });

            modelBuilder.Entity("VstepPractice.API.Models.Entities.WritingAssessment", b =>
                {
                    b.HasOne("VstepPractice.API.Models.Entities.Answer", "Answer")
                        .WithMany()
                        .HasForeignKey("AnswerId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Answer");
                });

            modelBuilder.Entity("VstepPractice.API.Models.Entities.Exam", b =>
                {
                    b.Navigation("SectionParts");

                    b.Navigation("StudentAttempts");
                });

            modelBuilder.Entity("VstepPractice.API.Models.Entities.Question", b =>
                {
                    b.Navigation("Options");
                });

            modelBuilder.Entity("VstepPractice.API.Models.Entities.SectionPart", b =>
                {
                    b.Navigation("Children");

                    b.Navigation("Questions");
                });

            modelBuilder.Entity("VstepPractice.API.Models.Entities.StudentAttempt", b =>
                {
                    b.Navigation("Answers");
                });

            modelBuilder.Entity("VstepPractice.API.Models.Entities.User", b =>
                {
                    b.Navigation("CreatedExams");

                    b.Navigation("StudentAttempts");
                });
#pragma warning restore 612, 618
        }
    }
}
