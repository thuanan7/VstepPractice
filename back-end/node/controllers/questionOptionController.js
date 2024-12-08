const QuestionOption = require('../models/QuestionOption')

// Get all options for a question
const getOptions = async (req, res) => {
  try {
    const { questionId } = req.params
    const options = await QuestionOption.findAll({ where: { questionId } })
    res.status(200).json(options)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch options' })
  }
}

// Create a new option
const createOption = async (req, res) => {
  try {
    const { content, isCorrect, orderNum, questionId } = req.body
    const option = await QuestionOption.create({
      content,
      isCorrect,
      orderNum,
      questionId,
    })
    res.status(201).json(option)
  } catch (err) {
    res.status(500).json({ error: 'Failed to create option' })
  }
}

// Update an option
const updateOption = async (req, res) => {
  try {
    const { id } = req.params
    const { content, isCorrect, orderNum } = req.body
    const option = await QuestionOption.findByPk(id)
    if (!option) return res.status(404).json({ error: 'Option not found' })
    await option.update({ content, isCorrect, orderNum })
    res.status(200).json(option)
  } catch (err) {
    res.status(500).json({ error: 'Failed to update option' })
  }
}

// Delete an option
const deleteOption = async (req, res) => {
  try {
    const { id } = req.params
    const option = await QuestionOption.findByPk(id)
    if (!option) return res.status(404).json({ error: 'Option not found' })
    await option.destroy()
    res.status(200).json({ message: 'Option deleted successfully' })
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete option' })
  }
}
module.exports = {
  deleteOption,
  updateOption,
  createOption,
  getOptions,
}
