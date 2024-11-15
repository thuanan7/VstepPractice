using AutoMapper;
using VstepPractice.API.Common.Utils;
using VstepPractice.API.Models.DTOs.Exams.Responses;
using VstepPractice.API.Repositories.Interfaces;

namespace VstepPractice.API.Services.Exams;

public class ExamService : IExamService
{
    private readonly IExamRepository _examRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    public ExamService(
        IExamRepository examRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _examRepository = examRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<Result<String>> GetExamsAsync(
        CancellationToken cancellationToken = default)
    {
        var k = await _examRepository.GetAllExamAsync(cancellationToken);
        return Result.Success("I'm Exams");
    }
}