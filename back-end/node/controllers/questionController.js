const Question = require("../models/Question");
const QuestionOption = require("../models/QuestionOption");

// Get all questions for a SectionPart
exports.getQuestions = async (req, res) => {
  try {
    const { sectionId } = req.params;
    const questions = await Question.findAll({ where: { sectionId }, include: [{ model: QuestionOption, as: "options" }] });
    res.status(200).json(questions);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch questions" });
  }
};

// Create a new question
exports.createQuestion = async (req, res) => {
  try {
    const { questionText, point, orderNum, sectionId } = req.body;
    const question = await Question.create({ questionText, point, orderNum, sectionId });
    res.status(201).json(question);
  } catch (err) {
    res.status(500).json({ error: "Failed to create question" });
  }
};

// Update a question
exports.updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { questionText, point, orderNum } = req.body;
    const question = await Question.findByPk(id);
    if (!question) return res.status(404).json({ error: "Question not found" });
    await question.update({ questionText, point, orderNum });
    res.status(200).json(question);
  } catch (err) {
    res.status(500).json({ error: "Failed to update question" });
  }
};

// Delete a question
exports.deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const question = await Question.findByPk(id);
    if (!question) return res.status(404).json({ error: "Question not found" });
    await question.destroy();
    res.status(200).json({ message: "Question deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete question" });
  }
};
