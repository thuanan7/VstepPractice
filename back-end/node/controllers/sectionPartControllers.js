const { SectionPart, Exam } = require('../../db/models')
const { typeSections } = require('../configs/enums')

/**
 * Create a new section part for the listening section
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const createListeningSectionPart = async (req, res) => {
  try {
    const { examId, instructions, audioUrl } = req.body
    const exam = await Exam.findByPk(examId)
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' })
    }

    const maxOrderNum = await SectionPart.max('orderNum', {
      where: {
        examId,
        type: typeSections.listening,
      },
    })

    const nextOrderNum = maxOrderNum ? maxOrderNum + 1 : 1
    const sectionPart = await SectionPart.create({
      examId,
      instructions,
      audioUrl,
      orderNum: nextOrderNum,
      type: typeSections.listening,
    })

    return res.status(201).json({
      message: 'Listening section part created successfully',
      data: sectionPart,
    })
  } catch (error) {
    console.error('Error creating listening section part:', error)
    return res
      .status(500)
      .json({ message: 'Internal server error', error: error.message })
  }
}

/**
 * Get Section Parts by Exam ID and Type
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const getSectionPartsByExamAndType = async (req, res) => {
  try {
    const { examId, type } = req.query
    const sectionParts = await SectionPart.findAll({
      attributes: [
        'id',
        'title',
        'instructions',
        'content',
        'type',
        'orderNum',
        'examId',
        'parentId',
      ],
      where: {
        examId: parseInt(examId, 10),
        type: parseInt(type, 10),
      },
      order: [['orderNum', 'ASC']],
    })

    if (!sectionParts || sectionParts.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No section parts found for the given examId and type.',
      })
    }

    return res.status(200).json({
      success: true,
      data: sectionParts,
    })
  } catch (error) {
    console.error('Error fetching section parts:', error)
    return res.status(500).json({
      success: false,
      message: 'Internal server error.',
      error: error.message,
    })
  }
}

module.exports = { createListeningSectionPart, getSectionPartsByExamAndType }
