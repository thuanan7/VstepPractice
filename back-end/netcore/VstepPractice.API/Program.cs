using MicroElements.Swashbuckle.FluentValidation.AspNetCore;
using Microsoft.ApplicationInsights.Extensibility;
using Microsoft.EntityFrameworkCore;
using Npgsql;
using Serilog;
using System.Reflection;
using VstepPractice.API.Data;
using VstepPractice.API.DependencyInjection.Extensions;

var builder = WebApplication.CreateBuilder(args);

Log.Logger = new LoggerConfiguration()
    .ReadFrom
    .Configuration(builder.Configuration)
    .WriteTo.ApplicationInsights(TelemetryConfiguration.Active, TelemetryConverter.Traces)
    .CreateLogger();

builder.Logging
    .ClearProviders()
    .AddSerilog();

builder.Host.UseSerilog();

// Load environment variables from .env file
builder.Configuration.LoadEnv("../../../.env");
builder.Configuration.LoadEnv();

// Add services to the container.
builder.Services.AddAiBackGroundServices();
builder.Services.AddOpenAiServices(builder.Configuration);


AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);
NpgsqlConnection.GlobalTypeMapper.EnableDynamicJson();

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("PostgresConnection"))
);

builder.Services.AddAutoMapper(Assembly.GetAssembly(typeof(Program)));

builder.Services.AddDependencyInjections();

builder.Services.AddScoreCalculationServices();

builder.Services.AddAzureStorageServices(builder.Configuration);

builder.Services.AddSpeechServices(builder.Configuration);

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services
        .AddSwaggerGenNewtonsoftSupport()
        .AddFluentValidationRulesToSwagger()
        .AddEndpointsApiExplorer()
        .AddSwagger();

builder.Services
    .AddApiVersioning(options => options.ReportApiVersions = true)
    .AddApiExplorer(options =>
    {
        options.GroupNameFormat = "'v'VVV";
        options.SubstituteApiVersionInUrl = true;
    });

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowNodejs", policy =>
    {
        policy.AllowAnyOrigin() 
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

builder.Services.AddApplicationInsightsTelemetry();

var app = builder.Build();

app.UseSerilogRequestLogging();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
   // app.ConfigureSwagger();
    // app.ApplyMigration();
    // Dont need seedData
    // await app.SeedDataAsync();
}

app.ConfigureSwagger();

app.UseCors("AllowNodejs");

// app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

try
{
    await app.RunAsync();
    Log.Information("Stopped cleanly");
}
catch (Exception ex)
{
    Log.Fatal(ex, "An unhandled exception occured during the execution of the application");
    await app.StopAsync();
}
finally
{
    Log.CloseAndFlush();
    await app.DisposeAsync();
}

public partial class Program { }