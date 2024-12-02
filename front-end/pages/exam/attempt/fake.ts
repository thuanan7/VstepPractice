import { VSTEPExam } from '@/features/exam/type'

export const VSTEPExamConfig: VSTEPExam = {
  sections: [
    {
      id: 'listening',
      title: 'Listening Section',
      instructions: '',
      type: 'listening',
      sectionPart: [
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
              id: 'L1Q3',
              type: 'multiple-choice',
              questionText: 'What is the main idea of the audio?',
              options: ['Option A', 'Option B', 'Option C', 'Option D'],
              correctAnswer: 'Option B',
            },
            {
              id: 'L1Q4',
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
      id: 'reading',
      title: 'Reading Section',
      instructions: '',
      type: 'reading',
      essayText:
        'This is an essay about the importance of education in modern society.',
      sectionPart: [
        {
          id: 'R1',
          type: 'multiple-choice',
          questionText: 'What is the main idea of the passage?',
          questions: [
            {
              id: 'R1Q1',
              type: 'multiple-choice',
              questionText: 'What is the main idea of the audio?',
              options: ['Option A', 'Option B', 'Option C', 'Option D'],
              correctAnswer: 'Option B',
            },
            {
              id: 'R1Q2',
              type: 'multiple-choice',
              questionText: 'What does the speaker imply?',
              options: ['Option A', 'Option B', 'Option C', 'Option D'],
              correctAnswer: 'Option C',
            },
            {
              id: 'R1Q3',
              type: 'multiple-choice',
              questionText: 'What is the main idea of the audio?',
              options: ['Option A', 'Option B', 'Option C', 'Option D'],
              correctAnswer: 'Option B',
            },
            {
              id: 'R1Q4',
              type: 'multiple-choice',
              questionText: 'What does the speaker imply?',
              options: ['Option A', 'Option B', 'Option C', 'Option D'],
              correctAnswer: 'Option C',
            },
          ],
        },
        {
          id: 'R2',
          type: 'multiple-choice',
          questionText: 'What is the main idea of the passage?',
          questions: [
            {
              id: 'R2Q1',
              type: 'multiple-choice',
              questionText: 'What is the main idea of the audio? R2',
              options: ['Option A', 'Option B', 'Option C', 'Option D'],
              correctAnswer: 'Option B',
            },
            {
              id: 'R2Q2',
              type: 'multiple-choice',
              questionText: 'What does the speaker imply? R2',
              options: ['Option A', 'Option B', 'Option C', 'Option D'],
              correctAnswer: 'Option C',
            },
            {
              id: 'R2Q3',
              type: 'multiple-choice',
              questionText: 'What is the main idea of the audio? R2',
              options: ['Option A', 'Option B', 'Option C', 'Option D'],
              correctAnswer: 'Option B',
            },
            {
              id: 'R2Q4',
              type: 'multiple-choice',
              questionText: 'What does the speaker imply? R2',
              options: ['Option A', 'Option B', 'Option C', 'Option D'],
              correctAnswer: 'Option C',
            },
          ],
        },
        ,
        {
          id: 'R3',
          type: 'multiple-choice',
          questionText: 'What is the main idea of the passage?',
          questions: [
            {
              id: 'R3Q1',
              type: 'multiple-choice',
              questionText: 'What is the main idea of the audio? R3',
              options: ['Option A', 'Option B', 'Option C', 'Option D'],
              correctAnswer: 'Option B',
            },
            {
              id: 'R3Q2',
              type: 'multiple-choice',
              questionText: 'What does the speaker imply? R3',
              options: ['Option A', 'Option B', 'Option C', 'Option D'],
              correctAnswer: 'Option C',
            },
            {
              id: 'R3Q3',
              type: 'multiple-choice',
              questionText: 'What is the main idea of the audio? R3',
              options: ['Option A', 'Option B', 'Option C', 'Option D'],
              correctAnswer: 'Option B',
            },
            {
              id: 'R3Q4',
              type: 'multiple-choice',
              questionText: 'What does the speaker imply? R3',
              options: ['Option A', 'Option B', 'Option C', 'Option D'],
              correctAnswer: 'Option C',
            },
          ],
        },
      ],
    },
    {
      id: 'writing',
      title: 'Writing Section',
      instructions: '',
      type: 'writing',
      sectionPart: [
        {
          id: 'W1',
          type: 'essay',
          instructions: 'You should spends 20 minutes to<br /><br /><b>You have asked ...</b><br /><br />Great to hear that  ... W1<br /><br />',
          questionText:
            'Write an essay about the importance of technology in education. W1',
        },
        {
          id: 'W2',
          type: 'essay',
          instructions: 'You should spends 20 minutes to<br /><br /><b>You have asked ...</b><br /><br />Great to hear that  ... W2<br /><br />',
          questionText:
            'Write an essay about the importance of technology in education. W2',
        },
      ],
    },
    {
      id: 'speaking',
      title: 'Speaking Section',
      instructions: '',
      type: 'speaking',
      sectionPart: [
        {
          id: 'S1',
          type: 'speaking',
          title: "Social Interaction (3')",
          questionText: "",
          audioUrl: "",
          pictureUrl: "",
          speakingPrompt:
            'You have 2 minutes to prepare and 2 minutes to speak.',
            questions: [
              {
                id: 'S1Q1',
                type: 'multiple-choice',
                questionText: "Now, the test begins. Let's talk about your favorite video",
                options: ['What is your favorite video?', 'Can you describe it?', 'Why do you like this video?', "Is there any thing you don't like about the video"]
              },
              {
                id: 'S1Q2',
                type: 'multiple-choice',
                questionText: "Now, Let's talk about your favorite childhood game",
                options: ['What was your favorite childhood game?', 'Can you describe it?', 'Why did you like this game?', "Is there any thing you didn't like about the game"]
              },
            ],
        },
        {
          id: 'S2',
          type: 'speaking',
          title: "Discuss Solutions (4')",
          questionText: 'Situation: You are looking for a place to take a communication skills course. Three ...',
          audioUrl: "",
          pictureUrl: "",
          speakingPrompt:
            'You have 2 minutes to prepare and 2 minutes to speak.',
            questions: [],
        },
        {
          id: 'S3',
          type: 'speaking',
          title: "Topic Development (5')",
          questionText: 'Topic: Learning how to make a cake can be a great ...',
          audioUrl: "",
          pictureUrl: "",
          speakingPrompt:
            'You have 2 minutes to prepare and 2 minutes to speak.',
            questions: [
              {
                id: 'S3Q1',
                type: 'multiple-choice',
                questionText: 'You do not need to ... ',
                options: ['1. What kinds of cake do people ...?', '2. What are the disadvantages ...?', '3. Do people learn how to makes ...? Why not?'],
              },
            ],
          },
      ],
    },
  ],
}
