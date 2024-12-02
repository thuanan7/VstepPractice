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

// Get all section parts
exports.getSectionParts = async (req, res) => {
  try {
    const sectionParts = await SectionPart.findAll({ include: [{ model: Exam, as: "exam" }] });
    res.status(200).json(sectionParts);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch section parts" });
  }
};

// Create new section part
exports.createSectionPart = async (req, res) => {
  try {
    const { title, instructions, content, orderNum, type, examId, parentId } = req.body;
    const sectionPart = await SectionPart.create({ title, instructions, content, orderNum, type, examId, parentId });
    res.status(201).json(sectionPart);
  } catch (err) {
    res.status(500).json({ error: "Failed to create section part" });
  }
};

// Update a section part
exports.updateSectionPart = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, instructions, content, orderNum, type, examId, parentId } = req.body;
    const sectionPart = await SectionPart.findByPk(id);
    if (!sectionPart) return res.status(404).json({ error: "Section part not found" });
    await sectionPart.update({ title, instructions, content, orderNum, type, examId, parentId });
    res.status(200).json(sectionPart);
  } catch (err) {
    res.status(500).json({ error: "Failed to update section part" });
  }
};

// Delete a section part
exports.deleteSectionPart = async (req, res) => {
  try {
    const { id } = req.params;
    const sectionPart = await SectionPart.findByPk(id);
    if (!sectionPart) return res.status(404).json({ error: "Section part not found" });
    await sectionPart.destroy();
    res.status(200).json({ message: "Section part deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete section part" });
  }
};

// Get child parts for a specific SectionPart
exports.getParts = async (req, res) => {
  try {
    const { parentId } = req.params;
    const parts = await SectionPart.findAll({ where: { parentId } });
    res.status(200).json(parts);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch child parts" });
  }
};

// Create a new child part
exports.createPart = async (req, res) => {
  try {
    const { title, instructions, content, orderNum, type, examId, parentId } = req.body;
    const childPart = await SectionPart.create({
      title,
      instructions,
      content,
      orderNum,
      type,
      examId,
      parentId,
    });
    res.status(201).json(childPart);
  } catch (err) {
    res.status(500).json({ error: "Failed to create child part" });
  }
};

// Update a child part
exports.updatePart = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, instructions, content, orderNum, type, examId, parentId } = req.body;
    const childPart = await SectionPart.findByPk(id);
    if (!childPart) return res.status(404).json({ error: "Child part not found" });
    await childPart.update({ title, instructions, content, orderNum, type, examId, parentId });
    res.status(200).json(childPart);
  } catch (err) {
    res.status(500).json({ error: "Failed to update child part" });
  }
};

// Delete a child part
exports.deletePart = async (req, res) => {
  try {
    const { id } = req.params;
    const childPart = await SectionPart.findByPk(id);
    if (!childPart) return res.status(404).json({ error: "Child part not found" });
    await childPart.destroy();
    res.status(200).json({ message: "Child part deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete child part" });
  }
};

module.exports = { createListeningSectionPart }
