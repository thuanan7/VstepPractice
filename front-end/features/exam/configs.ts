export const storePathConfigs = {
  list: 'exams',
}

export const sectionPartsPathConfigs = {
  listByType: 'section-parts',
  questions: 'section-parts/{partId}/questions',
  parts: 'section-parts/section',
  partById: 'section-parts/part',
}
export const questionPathConfigs = {
  createEmptyOption: 'questions/option',
  createEmptyQuestion: 'questions',
  deleteOption: 'questions/option/{optionId}',
  deleteQuestion: 'questions/{id}',
  updateQuestion: 'questions/{questionId}',
  updateOptions: 'questions/{questionId}/options',
}
export const attemptConfigs = {
  getAttemptByExamId: 'attempt/{examId}',
}

export enum SessionType {
  Listening = 1,
  Reading = 2,
  Writing = 3,
  Speaking = 4,
}
export const sessionTypeOptions = [
  { label: 'Nghe', value: SessionType.Listening },
  { label: 'Đọc', value: SessionType.Reading },
  { label: 'Viết', value: SessionType.Writing },
  { label: 'Nói', value: SessionType.Speaking },
]

export enum SectionPartTypes {
  Section = 1,
  Part = 2,
  Passage = 3,
}
