import { AttemptStatusType } from './configs'
export interface IExam {
  id: number
  title: string
  createdAt: string
  description: string
}
export interface Question {
  orderNum: number
  point: number
  id: number
  type: 'multiple-choice' | 'essay' | 'audio' | 'speaking'
  questionText: string
  options?: string[]
  correctAnswer?: string
  audioUrl?: string
  speakingPrompt?: string
}
export interface QuestionOption {
  content: string
  isCorrect: any
  orderNum: string
  id: number
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

export enum SectionType {
  Listening = 1,
  Reading = 2,
  Writing = 3,
  Speaking = 4,
}
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
  id?: string
  title: string
  instructions: string
  type: 'listening' | 'reading' | 'writing' | 'speaking'
  essayText?: string
  parent?: Section
  exam?: IExam
  orderNum?: number
  questions: Question[] | ListeningQuestion[]
  sectionPart:
    | Question[]
    | ListeningQuestion[]
    | ReadingQuestion[]
    | SpeakingQuestion
}
export interface VSTEPExam {
  sections: Section[]
}

//ROMIO
interface ISessionPartBase {
  title: string
  instructions: string
  content: string
  orderNum: number
  sectionType: number
  examId: number
  type: number
}
export interface ISessionPart extends ISessionPartBase {
  id: number
}
export interface IReqPostSessionPart extends ISessionPartBase {
  parentId?: number
}

export interface IOption {
  id: number
  content: string
  isCorrect: boolean
}

export interface IQuestion {
  id: number
  questionText: string
  point: number
  options: IOption[]
}

export interface ISumaryAttemptExam {
  id: string
  title: string
  description?: string
  date: string
}

export interface IAttemptExam {
  id: number
  title: string
  instructions?: string
  sectionType: number
  parts: IAttemptPart[]
}

export interface IAttemptPart {
  id: number
  title: string
  content?: string
  instructions?: string
  questions: IAttemptQuestion[]
}

export interface IAttemptQuestion {
  id: number
  questionText: string
  options: IAttemptOption[]
}

export interface IAttemptOption {
  id: number
  content: string
  chosen?: boolean
}

export interface IStartStudentAttempt {
  attempId: number
  examId: number
  title: string
  description: string
  status: AttemptStatusType
}

export interface ISummaryStudentAttempt {
  examId: number
  examTitle?: string
  examDescription?: string
  inprocess: IStartStudentAttempt
  attempts: ISummaryAttempt[]
}
export interface IAttemptAnswer {
  id: number
  answer: number | string
}

export interface ISummaryAttempt {
  id: number
  startTime: string
  endTime?: string
  finalCore: number
}
export interface IAttemptStudentAnswer {
  section: SectionType
  partId: number
  questions: IAttemptAnswer[]
}
