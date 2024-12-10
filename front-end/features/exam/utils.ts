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
