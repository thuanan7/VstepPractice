using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;
using VstepPractice.API.Common.Utils;
using VstepPractice.API.Data;
using VstepPractice.API.Models.Entities;
using VstepPractice.API.Repositories.Interfaces;

namespace VstepPractice.API.Repositories.Implementations;

public class ExamRepository : RepositoryBase<Exam, int>, IExamRepository
{
    public ExamRepository(ApplicationDbContext context) : base(context)
    {
    }

    public Task<PagedResult<Exam>> GetPagedAsync(Expression<Func<Exam, bool>>? predicate = null, int pageIndex = 1, int pageSize = 10,
        CancellationToken cancellationToken = default)
    {
        throw new NotImplementedException();
    }

    public async Task<Exam> GetAllExamAsync(CancellationToken cancellationToken = default)
    {
        var query = _context.Set<Exam>()
            .AsNoTracking()
            .AsQueryable();
        var s =await query.ToListAsync();
        throw new NotImplementedException();
    }
}