using VstepPractice.API.Services.Storage;

namespace VstepPractice.API.DependencyInjection.Extensions;

public static class AzureStorageExtensions
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
}
