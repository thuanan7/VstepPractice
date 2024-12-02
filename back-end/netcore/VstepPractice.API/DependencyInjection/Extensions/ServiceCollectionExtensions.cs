﻿using VstepPractice.API.Repositories.Implementations;
using VstepPractice.API.Repositories.Interfaces;
using VstepPractice.API.Services.AI;
using VstepPractice.API.Services.BackgroundServices;
using VstepPractice.API.Services.StudentAttempts;

namespace VstepPractice.API.DependencyInjection.Extensions;

public static class ServiceCollectionExtensions
{

    public static void AddDependencyInjections(this IServiceCollection services)
    {
        services.AddScoped<IStudentAttemptService, StudentAttemptService>();
        services.AddScoped<IExamRepository, ExamRepository>();
        services.AddScoped<IQuestionOptionRepository, QuestionOptionRepository>();
        services.AddScoped<IStudentAttemptRepository, StudentAttemptRepository>();
        services.AddScoped<IAnswerRepository, AnswerRepository>();
        services.AddScoped<IQuestionRepository, QuestionRepository>();
        services.AddScoped<IUnitOfWork, UnitOfWork>();
        services.AddScoped<IWritingAssessmentRepository, WritingAssessmentRepository>();

    }

    public static void AddAiBackGroundServices(this IServiceCollection services)
    {
        // 1. Register the background service as Singleton first
        services.AddSingleton<EssayScoringBackgroundService>();

        // 2. Register the interface implementation
        services.AddSingleton<IEssayScoringQueue>(sp =>
            sp.GetRequiredService<EssayScoringBackgroundService>());

        // 3. Register it as a hosted service
        services.AddHostedService(sp =>
            sp.GetRequiredService<EssayScoringBackgroundService>());
    }
}
