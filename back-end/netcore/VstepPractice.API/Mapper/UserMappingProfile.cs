using AutoMapper;
using VstepPractice.API.Common.Enums;
using VstepPractice.API.Common.Utils;
using VstepPractice.API.Models.DTOs.Exams.Responses;
using VstepPractice.API.Models.DTOs.Questions.Responses;
using VstepPractice.API.Models.DTOs.SectionParts.Responses;
using VstepPractice.API.Models.DTOs.StudentAttempts.Responses;

using VstepPractice.API.Models.Entities;

namespace VstepPractice.API.Mapper;

public class AutoMapperProfile : Profile
{
    public AutoMapperProfile()
    {
        // Exam mappings
        CreateMap<Exam, ExamResponse>()
            .ForMember(dest => dest.Title,
                opt => opt.MapFrom(src => src.Title ?? string.Empty))
            .ForMember(dest => dest.Description,
                opt => opt.MapFrom(src => src.Description ?? string.Empty))
            .ForMember(dest => dest.Sections,
                opt => opt.MapFrom(src => src.SectionParts.Where(sp => sp.ParentId == null)
                    .OrderBy(sp => sp.OrderNum)));

        // SectionPart mappings
        CreateMap<SectionPart, SectionPartResponse>()
            .ForMember(dest => dest.Title,
                opt => opt.MapFrom(src => src.Title))
            .ForMember(dest => dest.Instructions,
                opt => opt.MapFrom(src => src.Instructions))
            .ForMember(dest => dest.Content,
                opt => opt.MapFrom(src => src.Content))
            .ForMember(dest => dest.Type,
                opt => opt.MapFrom(src => src.Type))
            .ForMember(dest => dest.Children,
                opt => opt.MapFrom(src => src.Children.OrderBy(c => c.OrderNum)))
            .ForMember(dest => dest.Questions,
                opt => opt.MapFrom(src => src.Questions.OrderBy(q => q.OrderNum)));

        // Question mappings
        CreateMap<Question, QuestionResponse>()
            .ForMember(dest => dest.QuestionText,
                opt => opt.MapFrom(src => src.QuestionText ?? string.Empty))
            .ForMember(dest => dest.Points,
                opt => opt.MapFrom(src => src.Point))
            .ForMember(dest => dest.Options,
                opt => opt.MapFrom(src => src.Options.OrderBy(o => o.OrderNum)));

        // QuestionOption mappings
        CreateMap<QuestionOption, QuestionOptionResponse>()
            .ForMember(dest => dest.OptionText,
                opt => opt.MapFrom(src => src.Content ?? string.Empty))
            .ForMember(dest => dest.IsCorrect,
                opt => opt.MapFrom(src => src.IsCorrect));

        // StudentAttempt mappings
        CreateMap<StudentAttempt, AttemptResponse>()
            .ForMember(dest => dest.ExamTitle,
                opt => opt.MapFrom(src => src.Exam.Title ?? string.Empty))
            .ForMember(dest => dest.Answers,
                opt => opt.MapFrom(src => src.Answers.OrderBy(a => a.Question.OrderNum)));

        CreateMap<StudentAttempt, AttemptResultResponse>()
            .ForMember(dest => dest.ExamTitle,
                opt => opt.MapFrom(src => src.Exam.Title ?? string.Empty))
            .ForMember(dest => dest.StartTime,
                opt => opt.MapFrom(src => src.StartTime))
            .ForMember(dest => dest.EndTime,
                opt => opt.MapFrom(src => src.EndTime!))
            .ForMember(dest => dest.Answers,
                opt => opt.MapFrom(src => src.Answers.OrderBy(a => a.Question.OrderNum)))
            .ForMember(dest => dest.SectionScores,
                opt => opt.Ignore())  // Calculated in service
            .ForMember(dest => dest.FinalScore,
                opt => opt.Ignore());  // Calculated in service

        // Answer mappings
        CreateMap<Answer, AnswerResponse>();

        // WritingAssessment mappings
        CreateMap<WritingAssessment, WritingScoreDetails>()
            .ForMember(dest => dest.TaskAchievement,
                opt => opt.MapFrom(src => src.TaskAchievement))
            .ForMember(dest => dest.CoherenceCohesion,
                opt => opt.MapFrom(src => src.CoherenceCohesion))
            .ForMember(dest => dest.LexicalResource,
                opt => opt.MapFrom(src => src.LexicalResource))
            .ForMember(dest => dest.GrammarAccuracy,
                opt => opt.MapFrom(src => src.GrammarAccuracy));
    }
}