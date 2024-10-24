'use strict';
const models = require('../../models')
const examController = {}
examController.getAllExam = async (req, res) => {
    const exams = await models.Exam.findAll();
    res.status(200).json(exams);
}
module.exports = examController;
