using VstepPractice.API.Services.ScoreCalculation.Implementations;
using VstepPractice.API.Services.ScoreCalculation;

namespace VstepPractice.API.DependencyInjection.Extensions;

public static class ScoreCalculationServiceExtensions
{
    public static IServiceCollection AddScoreCalculationServices(
        this IServiceCollection services)
    {
        // Đăng ký các calculator dưới dạng ISectionScoreCalculator
        services.AddScoped<ISectionScoreCalculator, ListeningScoreCalculator>();
        services.AddScoped<ISectionScoreCalculator, AlternativeReadingScoreCalculator>();
        services.AddScoped<ISectionScoreCalculator, WritingScoreCalculator>();

        // Đăng ký VstepScoreCalculator riêng
        services.AddScoped<IVstepScoreCalculator, VstepScoreCalculator>();

        return services;
    }
}
