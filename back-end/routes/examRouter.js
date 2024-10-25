'use strict';
const express = require('express');
const router = express.Router();
const examController = require('../controllers/examController');
/**
 * @swagger
 * tags:
 *   - name: "Exams"
 *     description: "API liên quan đến các bài thi"
 */

/**
 * @swagger
 * /api/exams:
 *   get:
 *     tags:
 *       - "Exams"
 *     summary: Lấy danh sách các bài thi
 *     responses:
 *       200:
 *         description: Thành công
 */
router.get('/', examController.getAllExam)
module.exports = router;
