export const storePathConfigs = {
  list: 'exams',
}

export const sectionPartsPathConfigs = {
  listByType: 'section-parts',
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
  { label: 'Listening', value: SessionType.Listening },
  { label: 'Reading', value: SessionType.Reading },
  { label: 'Writing', value: SessionType.Writing },
  { label: 'Speaking', value: SessionType.Speaking },
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
