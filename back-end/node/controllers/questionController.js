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
const createEmptyQuestion = async (req, res) => {
  try {
    const { partId } = req.body
    if (!partId) {
      return res.status(400).json({
        success: false,
        message: 'partId is required',
      })
    }
    const maxOrderQuestion = await Question.findOne({
      where: { passageId: partId },
      order: [['orderNum', 'DESC']],
    })

    const newOrderNum = maxOrderQuestion ? maxOrderQuestion.orderNum + 1 : 0
    const question = await Question.create({
      questionText: 'Nội dung câu hỏi',
      point: 1,
      orderNum: newOrderNum,
      passageId: partId,
    })

    const option = await QuestionOption.create({
      content: 'Nội dung câu trả lời',
      isCorrect: false,
      questionId: question.id,
      orderNum: 0,
    })

    res.status(201).json({
      success: true,
      message: 'Question created successfully',
      data: {
        question: {
          ...question.toJSON(),
          options: [option],
        },
      },
    })
  } catch (err) {
    console.error('Error creating empty question:', err)
    res.status(500).json({
      success: false,
      message: 'Failed to create empty question',
    })
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

const removeQuestion = async (req, res) => {
  try {
    const { id } = req.params
    const question = await Question.findByPk(id)

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found',
      })
    }
    await QuestionOption.destroy({
      where: { questionId: id },
    })
    await question.destroy()

    res.status(200).json({
      success: true,
      message: 'Question and related options removed successfully',
    })
  } catch (err) {
    console.error('Error removing question:', err)
    res.status(500).json({
      success: false,
      message: 'Failed to remove question',
    })
  }
}
module.exports = {
  deleteQuestion,
  updateQuestion,
  getQuestions,
  createEmptyQuestion,
  removeQuestion,
}
