import { VSTEPExam } from '@/features/exam/type'
import { SectionPartType } from '@/features/exam/configs.ts'

export const VSTEPExamConfig: VSTEPExam = {
  sections: [
    {
      id: 1,
      title: 'Listening Section',
      type: SectionPartType.listening,
      questions: [
        {
          id: 'L1',
          type: 'audio',
          audioUrl: 'https://example.com/audio1.mp3',
          questions: [
            {
              id: 'L1Q1',
              type: 'multiple-choice',
              questionText: 'What is the main idea of the audio?',
              options: ['Option A', 'Option B', 'Option C', 'Option D'],
              correctAnswer: 'Option B',
            },
            {
              id: 'L1Q2',
              type: 'multiple-choice',
              questionText: 'What does the speaker imply?',
              options: ['Option A', 'Option B', 'Option C', 'Option D'],
              correctAnswer: 'Option C',
            },
            {
              id: 'L1Q1',
              type: 'multiple-choice',
              questionText: 'What is the main idea of the audio?',
              options: ['Option A', 'Option B', 'Option C', 'Option D'],
              correctAnswer: 'Option B',
            },
            {
              id: 'L1Q2',
              type: 'multiple-choice',
              questionText: 'What does the speaker imply?',
              options: ['Option A', 'Option B', 'Option C', 'Option D'],
              correctAnswer: 'Option C',
            },
          ],
        },
        {
          id: 'L2',
          type: 'audio',
          audioUrl: 'https://example.com/audio2.mp3',
          questions: [
            {
              id: 'L2Q1',
              type: 'multiple-choice',
              questionText: 'What is the tone of the speaker?',
              options: ['Option A', 'Option B', 'Option C', 'Option D'],
              correctAnswer: 'Option A',
            },
          ],
        },
      ],
    },
    {
      id: 2,
      title: 'Reading Section',
      type: SectionPartType.reading,
      content:
        'This is an essay about the importance of education in modern society.',
      questions: [
        {
          id: 'R1',
          type: 'multiple-choice',
          questionText: 'What is the main idea of the passage?',
          options: ['Option A', 'Option B', 'Option C', 'Option D'],
          correctAnswer: 'Option C',
        },
      ],
    },
    {
      id: 3,
      title: 'Writing Section',
      type: SectionPartType.writing,
      questions: [
        {
          id: 'W1',
          type: 'essay',
          questionText:
            'Write an essay about the importance of technology in education.',
        },
      ],
    },
    {
      id: 4,
      title: 'Speaking Section',
      type: SectionPartType.speaking,
      questions: [
        {
          id: 'S1',
          type: 'speaking',
          questionText: 'Describe your favorite holiday.',
          speakingPrompt:
            'You have 2 minutes to prepare and 2 minutes to speak.',
        },
      ],
    },
  ],
}
