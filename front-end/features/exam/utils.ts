import { IOption } from '@/features/exam/type.ts'

export const isMatchWithManageExam = (pathname: string) => {
  return /^\/admin\/questions\/\d+$/.test(pathname)
}

export const optionsArrayToObject = (
  options: IOption[],
): { [key: number]: IOption } => {
  return options.reduce(
    (acc, option) => {
      acc[option.id] = option
      return acc
    },
    {} as { [key: number]: IOption },
  )
}
export const areOptionsDifferent = (
  optionsArray: IOption[],
  optionsObject: { [key: number]: IOption },
): boolean => {
  if (optionsArray.length !== Object.keys(optionsObject).length) {
    return true
  }

  for (const option of optionsArray) {
    const correspondingOption = optionsObject[option.id]
    if (
      !correspondingOption ||
      correspondingOption.content !== option.content ||
      correspondingOption.isCorrect !== option.isCorrect
    ) {
      return true
    }
  }
  return false
}
export function formatDateTime(dateTime: string | null | undefined): string {
  if (!dateTime) {
    return ''
  }
  try {
    const date = new Date(dateTime)
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(date)
  } catch (error) {
    console.error('Invalid date format:', error)
    return ''
  }
}
