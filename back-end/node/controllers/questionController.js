const { Question, QuestionOption } = require('../../db/models')
const getQuestions = async (req, res) => {
  try {
    const { id } = req.params
    const questions = await Question.findAll({
      attributes: ['id', 'questionText', 'point'],
      where: { passageId: id },
      include: [
        {
          model: QuestionOption,
          as: 'options',
          attributes: ['id', 'content', 'isCorrect'],
        },
      ],
    })
    res.status(200).json({
      success: true,
      data: questions,
      message: 'get list question successfully',
    })
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: 'Failed to fetch questions' })
  }
}
// Create a new question
const createQuestion = async (req, res) => {
  try {
    const { questionText, point, orderNum, sectionId } = req.body
    const question = await Question.create({
      questionText,
      point,
      orderNum,
      sectionId,
    })
    res.status(201).json(question)
  } catch (err) {
    res.status(500).json({ error: 'Failed to create question' })
  }
}

// Update a question
const updateQuestion = async (req, res) => {
  try {
    const { id } = req.params
    const { questionText, point, orderNum } = req.body
    const question = await Question.findByPk(id)
    if (!question) return res.status(404).json({ error: 'Question not found' })
    await question.update({ questionText, point, orderNum })
    res.status(200).json(question)
  } catch (err) {
    res.status(500).json({ error: 'Failed to update question' })
  }
}

// Delete a question
const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params
    const question = await Question.findByPk(id)
    if (!question) return res.status(404).json({ error: 'Question not found' })
    await question.destroy()
    res.status(200).json({ message: 'Question deleted successfully' })
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete question' })
  }
}
module.exports = {
  deleteQuestion,
  updateQuestion,
  createQuestion,
  getQuestions,
}
