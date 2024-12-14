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

examController.deleteExam = async (req, res) => {
  try {
    const examId = parseInt(req.params.id, 10)
    if (!examId) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid exam ID' })
    }

    const attempts = await models.StudentAttempt.findAll({ where: { examId } })
    if (attempts.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Không thể xóa đề thi vì đã có thí sinh làm bài',
      })
    }

    const deleted = await models.Exam.destroy({ where: { id: examId } })
    if (deleted) {
      return res
        .status(200)
        .json({ success: true, message: 'Đã xóa đề thi thành công' })
    } else {
      return res
        .status(404)
        .json({ success: false, message: 'Không tìm thấy đề thi để xóa' })
    }
  } catch (error) {
    console.error('Error deleting exam:', error)
    return res.status(500).json({ success: false, message: 'Server error' })
  }
}

module.exports = examController
