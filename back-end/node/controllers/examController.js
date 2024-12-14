'use strict'
const models = require('../../db/models')
const { formatResponse } = require('../utils/responseFormatter')
const examController = {}
examController.getAllExam = async (req, res) => {
  const exams = await models.Exam.findAll()
  res
    .status(200)
    .json(formatResponse(true, 'Get list exam successfully', exams))
}
examController.createEmptyExam = async (req, res) => {
  try {
    const newExam = await models.Exam.create({
      title: 'Nội dung đề thi',
      description: 'Mô tả đề thi',
      userId: req.user.id,
    })

    res.status(201).json({
      success: true,
      message: 'Tạo đề thi thành công',
      data: newExam,
    })
  } catch (error) {
    console.error('Error creating empty exam:', error)
    res.status(500).json({
      success: false,
      message: 'Tạo đề thi lỗi',
      error: error.message,
    })
  }
}
examController.updateExam = async (req, res) => {
  try {
    const { id } = req.params
    const { title, description } = req.body

    const exam = await models.Exam.findByPk(id)
    if (!exam) {
      return res.status(404).json({
        success: false,
        message: 'Exam not found',
      })
    }

    exam.title = title || exam.title
    exam.description = description || exam.description
    await exam.save()
    res.status(200).json({
      success: true,
      message: 'Exam updated successfully',
      data: exam,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update exam',
      error: error.message,
    })
  }
}

module.exports = examController
