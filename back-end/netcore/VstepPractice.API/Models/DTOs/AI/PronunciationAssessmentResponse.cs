namespace VstepPractice.API.Models.DTOs.AI;

public class PronunciationAssessmentResponse
{
    // Pronunciation scores (0-100)
    public decimal AccuracyScore { get; set; }
    public decimal FluencyScore { get; set; }
    public decimal PronScore { get; set; }
    public decimal ProsodyScore { get; set; }

    // Content assessment scores (0-100)
    public decimal GrammarScore { get; set; }
    public decimal VocabularyScore { get; set; }
    public decimal TopicScore { get; set; }

    public string RecognizedText { get; set; } = string.Empty;

    // Collection of word-level assessments
    public ICollection<WordAssessmentResult> Words { get; set; } = new List<WordAssessmentResult>();

    // JSON containing full detailed result
    public string DetailedResultJson { get; set; } = string.Empty;
}

public class WordAssessmentResult
{
    public string Word { get; set; } = string.Empty;
    public decimal AccuracyScore { get; set; }
    public string ErrorType { get; set; } = string.Empty; // e.g., Mispronunciation, Omission, Insertion

    // Optional phoneme-level details if Granularity.Phoneme was specified
    public ICollection<PhonemeAssessment>? Phonemes { get; set; }
}

public class PhonemeAssessment
{
    public string Phoneme { get; set; } = string.Empty;
    public decimal AccuracyScore { get; set; }
    public long Offset { get; set; } // Start position in milliseconds
    public int Duration { get; set; } // Duration in milliseconds
}
