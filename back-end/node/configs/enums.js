const typeSections = {
  listening: 0,
  reading: 1,
  writing: 2,
  speaking: 3,
}
const typeSectionPart = {
  section: 1,
  part: 2,
  passage: 3,
}

const hostStudentSection = {
  [`${typeSections.listening}`]: 'submit-section',
  [`${typeSections.reading}`]: 'submit-section',
  [`${typeSections.writing}`]: 'submit-section',
  [`${typeSections.speaking}`]: 'submit-speaking-section',
}

const fnParseData = {
  [`${typeSections.listening}`]: function (questions) {
    return parseQuestionFromReadingListening(questions)
  },
  [`${typeSections.reading}`]: function (questions) {
    return parseQuestionFromReadingListening(questions)
  },
  [`${typeSections.writing}`]: 'submit-section',
  [`${typeSections.speaking}`]: 'submit-speaking-section',
}
module.exports = {
  typeSections,
  typeSectionPart,
  hostStudentSection,
  fnParseData,
}

function parseQuestionFromReadingListening(questions) {
  return questions.map((x) => {
    return {
      questionId: x.id,
      selectedOptionId: x.answer,
    }
  })
}
