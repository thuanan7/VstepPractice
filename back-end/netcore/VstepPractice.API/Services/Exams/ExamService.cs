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

    public async Task<Result<PagedResult<ExamResponse>>> GetExamsAsync(
        int pageIndex = 1,
        int pageSize = 10,
        CancellationToken cancellationToken = default)
    {
        var pagedResult = await _examRepository.GetPagedAsync(
            null, pageIndex, pageSize, cancellationToken);

        var examResponses = _mapper.Map<List<ExamResponse>>(pagedResult.Items);
        var result = PagedResult<ExamResponse>.Create(
            examResponses, pagedResult.PageIndex, pagedResult.PageSize, pagedResult.TotalCount);

        return Result.Success(result);
    }

    public async Task<Result<PagedResult<ExamResponse>>> GetExamsByUserIdAsync(
    int userId,
    int pageIndex,
    int pageSize,
    CancellationToken cancellationToken)
    {
        // Sử dụng GetPagedAsync từ ExamRepository thay vì tự xây dựng query
        var pagedResult = await _unitOfWork.ExamRepository.GetPagedAsync(
            e => e.CreatedById == userId,
            pageIndex,
            pageSize,
            cancellationToken);

        var examResponses = _mapper.Map<List<ExamResponse>>(pagedResult.Items);
        var result = PagedResult<ExamResponse>.Create(
            examResponses,
            pagedResult.PageIndex,
            pagedResult.PageSize,
            pagedResult.TotalCount);

        return Result.Success(result);
    }

    public async Task<Result<ExamResponse>> GetExamByIdAsync(
        int id,
        CancellationToken cancellationToken = default)
    {
        var exam = await _examRepository.FindByIdAsync(id, cancellationToken);
        if (exam == null)
        {
            return Result.Failure<ExamResponse>(Error.NotFound);
        }

        var response = _mapper.Map<ExamResponse>(exam);
        return Result.Success(response);
    }
}