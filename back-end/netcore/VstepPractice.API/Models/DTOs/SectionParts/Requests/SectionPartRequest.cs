using VstepPractice.API.Models.DTOs.Questions.Requests;

namespace VstepPractice.API.Models.DTOs.SectionParts.Requests;

public class SectionPartRequest
{
    public string Title { get; set; } = string.Empty;
    public string? Instructions { get; set; }
    public string? Content { get; set; }
    public int OrderNum { get; set; }
    public int? ParentId { get; set; }
    public List<QuestionRequest> Questions { get; set; } = new();
}
