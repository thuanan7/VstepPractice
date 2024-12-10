using VstepPractice.API.Services.Speech;
using VstepPractice.API.Services.Storage;

namespace VstepPractice.API.DependencyInjection.Extensions;

public static class AzureServiceExtensions
{
    public static IServiceCollection AddAzureStorageServices(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services.Configure<AzureStorageOptions>(
            configuration.GetSection(AzureStorageOptions.SectionName));

        services.AddScoped<IFileStorageService, AzureBlobStorageService>();
        return services;
    }

    public static void AddSpeechServices(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services.Configure<AzureSpeechOptions>(
            configuration.GetSection(AzureSpeechOptions.SectionName));

        //services.AddScoped<ISpeechToTextService, AzureSpeechToTextService>();

        // OpenAPI is a better choice for our use case
        services.AddScoped<ISpeechToTextService, WhisperTranscriptionService>();

        services.AddScoped<IAzurePronunciationService, AzurePronunciationService>();
    }
}
