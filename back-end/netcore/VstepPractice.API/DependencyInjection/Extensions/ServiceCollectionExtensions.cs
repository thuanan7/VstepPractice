using Betalgo.Ranul.OpenAI.Extensions;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using VstepPractice.API.Data;
using VstepPractice.API.Models.Entities;
using VstepPractice.API.Repositories.Implementations;
using VstepPractice.API.Repositories.Interfaces;
using VstepPractice.API.Services.AI;
using VstepPractice.API.Services.Exams;

namespace VstepPractice.API.DependencyInjection.Extensions;

public static class ServiceCollectionExtensions
{
    
    public static void AddDependencyInjections(this IServiceCollection services)
    {
        services.AddScoped<IExamService, ExamService>();
        services.AddScoped<IExamRepository, ExamRepository>();
        services.AddScoped<IUnitOfWork, UnitOfWork>();
    }

    public static void AddAuthenServices(this IServiceCollection services, IConfiguration configuration)
    {
        var scret = configuration["JWT:SECRET"];
        var key = Encoding.ASCII.GetBytes(scret ?? "b2TestProjectSecretKey1234567890123456!");

        services.AddAuthentication(x =>
        {
            x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        }).AddJwtBearer(x =>
        {
            x.SaveToken = true;
            x.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuer = false, 
                ValidIssuer = "api-gateway",
                ValidateAudience = false,
                ValidateLifetime = true,
                ClockSkew = TimeSpan.Zero
            };
        });
    }

    public static void AddAiBackGroundServices(this IServiceCollection services)
    {
        // // 1. Register the background service as Singleton first
        // services.AddSingleton<EssayScoringBackgroundService>();
        //
        // // 2. Register the interface implementation
        // services.AddSingleton<IEssayScoringQueue>(sp =>
        //     sp.GetRequiredService<EssayScoringBackgroundService>());
        //
        // // 3. Register it as a hosted service
        // services.AddHostedService(sp =>
        //     sp.GetRequiredService<EssayScoringBackgroundService>());
    }
}
