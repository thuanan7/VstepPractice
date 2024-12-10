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
}

export enum SectionPartType {
  listening = 0,
  reading = 1,
  writing = 2,
  speaking = 3,
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

export const sectionPartTypeOptions = [
  { label: 'Section', value: SectionPartTypes.Section },
  { label: 'Part', value: SectionPartTypes.Part },
  { label: 'Passage', value: SectionPartTypes.Passage },
]
