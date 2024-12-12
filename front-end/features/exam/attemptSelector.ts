import { createSelector } from '@reduxjs/toolkit'
import { IAttemptExam } from '@/features/exam/type'

import { RootState } from '@/app/store'

export const selectSections = createSelector(
  [(state: RootState) => state.examStudent.sections],
  (sections) =>
    (sections || []).map((section: IAttemptExam) => ({
      id: section.id,
      title: section.title,
      instructions: section.instructions,
      sectionType: section.sectionType,
    })),
)

export const selectPartsBySectionId = (sectionId: string | null) =>
  createSelector(
    [(state: RootState) => state.examStudent?.sections],
    (sections) => {
      if (!sections || !sectionId || sections?.length === 0) return []
      const sectionIdNeedFind = Number(sectionId)
      const section = sections.find((sec) => sec.id === sectionIdNeedFind)
      return section
        ? section.parts.map((_part) => {
            const dataQuestions =
              _part.questions && _part.questions.length > 0
                ? _part.questions.map((x, index) => {
                    return { title: `${index + 1}`, id: x.id, completed: false }
                  })
                : []
            return {
              id: _part.id,
              title: _part.title,
              questions: dataQuestions,
            }
          })
        : []
    },
  )

export const selectPartBySectionAndPartId = (
  sectionId: number,
  partId: number | null,
) =>
  createSelector(
    [(state: RootState) => state.examStudent?.sections],
    (sections) => {
      if (!sections || !sectionId || sections.length === 0)
        return {
          part: null,
          sectionType: 0,
        }
      const section = sections.find((sec) => sec.id === sectionId)
      if (!section)
        return {
          part: null,
          sectionType: 0,
        }
      const part = partId ? section.parts.find((p) => p.id === partId) : null
      return {
        part: part || null,
        sectionType: section.sectionType,
      }
    },
  )
