const { SectionPart, Exam } = require('../../db/models')
const { typeSections, typeSectionPart } = require('../configs/enums')
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

// Get all section parts by id
const getSectionParts = async (req, res) => {
  try {
    const sectionParts = await SectionPart.findAll({
      attributes: [
        'id',
        'title',
        'instructions',
        'content',
        'orderNum',
        'sectionType',
        'type',
        'examId',
      ],
      where: { examId: req.params.id, parentId: null },
    })
    res.status(200).json({ success: true, data: sectionParts })
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: 'Failed to fetch section parts' })
  }
}

// Create new section part
const createSectionPart = async (req, res) => {
  const { title, instructions, content, type, examId, parentId, sectionType } =
    req.body
  if (!examId) {
    return res
      .status(400)
      .json({ success: false, message: 'Missing required parameter: examId' })
  }
  const finalType = parentId ? type : typeSectionPart.section
  try {
    const lastSectionPart = await SectionPart.findOne({
      where: { examId, sectionType },
      order: [['orderNum', 'DESC']],
    })
    const orderNum = lastSectionPart ? lastSectionPart.orderNum + 1 : 1
    const sectionPart = await SectionPart.create({
      title,
      instructions,
      content,
      orderNum,
      type: finalType,
      sectionType,
      examId,
      parentId,
    })
    res
      .status(201)
      .json({ success: true, message: 'Create Session Part SuccessFully' })
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: 'Failed to create section part' })
  }
}

// Update a section part
const updateSectionPart = async (req, res) => {
  try {
    const { id } = req.params
    const { title, instructions, content, orderNum, type, examId, parentId } =
      req.body
    const sectionPart = await SectionPart.findByPk(id)
    if (!sectionPart)
      return res.status(404).json({ error: 'Section part not found' })
    await sectionPart.update({
      title,
      instructions,
      content,
      orderNum,
      type,
      examId,
      parentId,
    })
    res.status(200).json(sectionPart)
  } catch (err) {
    res.status(500).json({ error: 'Failed to update section part' })
  }
}

// Delete a section part
const deleteSectionPart = async (req, res) => {
  try {
    const { id } = req.params
    const sectionPart = await SectionPart.findByPk(id)
    if (!sectionPart)
      return res
        .status(404)
        .json({ success: false, message: 'Section part not found' })
    await sectionPart.destroy()
    res
      .status(200)
      .json({ success: true, message: 'Section part deleted successfully' })
  } catch (err) {
    res
      .status(500)
      .json({ success: true, message: 'Failed to delete section part' })
  }
}

// Get child parts for a specific SectionPart
const getParts = async (req, res) => {
  try {
    const { parentId } = req.params
    const parts = await SectionPart.findAll({ where: { parentId } })
    res.status(200).json(parts)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch child parts' })
  }
}

// Create a new child part
const createPart = async (req, res) => {
  try {
    const { title, instructions, content, orderNum, type, examId, parentId } =
      req.body
    const childPart = await SectionPart.create({
      title,
      instructions,
      content,
      orderNum,
      type,
      examId,
      parentId,
    })
    res.status(201).json(childPart)
  } catch (err) {
    res.status(500).json({ error: 'Failed to create child part' })
  }
}

// Update a child part
const updatePart = async (req, res) => {
  try {
    const { id } = req.params
    const { title, instructions, content, orderNum, type, examId, parentId } =
      req.body
    const childPart = await SectionPart.findByPk(id)
    if (!childPart)
      return res.status(404).json({ error: 'Child part not found' })
    await childPart.update({
      title,
      instructions,
      content,
      orderNum,
      type,
      examId,
      parentId,
    })
    res.status(200).json(childPart)
  } catch (err) {
    res.status(500).json({ error: 'Failed to update child part' })
  }
}

// Delete a child part
const deletePart = async (req, res) => {
  try {
    const { id } = req.params
    const childPart = await SectionPart.findByPk(id)
    if (!childPart)
      return res.status(404).json({ error: 'Child part not found' })
    await childPart.destroy()
    res.status(200).json({ message: 'Child part deleted successfully' })
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete child part' })
  }
}

module.exports = {
  createListeningSectionPart,
  deletePart,
  updatePart,
  createPart,
  getParts,
  deleteSectionPart,
  updateSectionPart,
  createSectionPart,
  getSectionParts,
}
