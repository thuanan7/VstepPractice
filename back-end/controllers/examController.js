'use strict';
const models = require('../../models');
const {formatResponse} = require('../utils/responseFormatter')
const examController = {}
examController.getAllExam = async (req, res) => {
    const exams = await models.Exam.findAll();
    res.status(200).json(formatResponse(true, 'Get list exam successfully', exams));
}
module.exports = examController;
