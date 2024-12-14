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
module.exports = examController
