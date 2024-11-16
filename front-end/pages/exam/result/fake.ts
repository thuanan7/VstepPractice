export const mockResult = {
  overallScore: 72, // Tổng điểm
  sectionScores: {
    listening: 18, // Điểm Listening
    reading: 20, // Điểm Reading
    writing: 22, // Điểm Writing
    speaking: 12, // Điểm Speaking
  },
  answers: [
    {
      id: 'L1',
      questionText: 'What is the main idea of the audio?',
      correctAnswer: 'Option B',
      studentAnswer: 'Option B',
      isCorrect: true,
    },
    {
      id: 'L2',
      questionText: "What does the speaker mean by 'sustainability'?",
      correctAnswer: 'Option A',
      studentAnswer: 'Option C',
      isCorrect: false,
    },
    {
      id: 'R1',
      questionText: 'What is the main idea of the passage?',
      correctAnswer: 'Option C',
      studentAnswer: 'Option C',
      isCorrect: true,
    },
    {
      id: 'R2',
      questionText: "Which word in the passage means 'rapid growth'?",
      correctAnswer: 'Option D',
      studentAnswer: 'Option D',
      isCorrect: true,
    },
    {
      id: 'W1',
      questionText: 'Write an essay about the importance of education.',
      correctAnswer: '',
      studentAnswer:
        'Education is crucial in shaping the future of individuals and societies...',
      isCorrect: true, // Writing and Speaking results are usually subjective
    },
    {
      id: 'S1',
      questionText: 'Describe your favorite holiday.',
      correctAnswer: '',
      studentAnswer: 'My favorite holiday is Christmas because...',
      isCorrect: true,
    },
  ],
}
