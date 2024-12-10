export const isMatchWithManageExam = (pathname: string) => {
  return /^\/admin\/questions\/\d+$/.test(pathname)
}
