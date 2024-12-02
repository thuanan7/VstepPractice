export interface IExam {
  id: number
  title: string
  createdAt: string
  description: string
}
// Interface cho một câu hỏi
export interface Question {
  id: string
  type: 'multiple-choice' | 'essay' | 'audio' | 'speaking'
  questionText: string
  options?: string[]
  correctAnswer?: string
  audioUrl?: string
  speakingPrompt?: string
}
export interface BaseQuestion {
  id: string
  questionText: string
  type: 'multiple-choice' | 'essay' | 'speaking' | 'audio'
}

export interface MultipleChoiceQuestion extends BaseQuestion {
  type: 'multiple-choice'
  options: string[]
  correctAnswer?: string // Optional if not needed
}

export interface EssayQuestion extends BaseQuestion {
  type: 'essay'
  instructions: string
}

export interface SpeakingQuestion extends BaseQuestion {
  type: 'speaking'
  title: string
  questionText: string
  audioUrl: string
  pictureUrl: string
  questions: Question[]
  speakingPrompt: string
}

export interface AudioQuestion extends BaseQuestion {
  type: 'audio'
  audioUrl: string
  questions: MultipleChoiceQuestion[]
}

export interface ReadingQuestions extends BaseQuestion {
  type: 'multiple-choice'
  questions: MultipleChoiceQuestion[]
}

export type QuestionType =
  | MultipleChoiceQuestion
  | EssayQuestion
  | SpeakingQuestion
  | AudioQuestion

export interface ListeningQuestion {
  id: string
  type: 'audio'
  audioUrl: string
  questions: Question[]
}

export interface ReadingQuestion {
  id: string
  type: 'multiple-choice'
  questionText: string
  questions: Question[]
}

export interface Section {
  id: string
  title: string
  instructions: string
  type: 'listening' | 'reading' | 'writing' | 'speaking'
  essayText?: string
  sectionPart: Question[] | ListeningQuestion[] | ReadingQuestion[] | SpeakingQuestion
}
export interface VSTEPExam {
  sections: Section[]
}

export interface SectionListening extends Section {}
