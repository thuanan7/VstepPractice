'use strict'
const express = require('express')
const router = express.Router()
const openAIController = require('../controllers/openAIController')
const authMiddleware = require('../middlewares/authMiddleware')
/**
 * @swagger
 * tags:
 *   name: AI
 *   description: Call AI API from .NetCore
 */

/**
 * @swagger
 * /ai/test:
 *   get:
 *     summary: Test Server with authentication
 *     tags: [AI]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful response string message from .NETCore
 *       401:
 *         description: Unauthorized
 */
router.get('/test', authMiddleware, openAIController.testConnection)

/**
 * @swagger
 * /ai/start:
 *   post:
 *     summary: Start Student Attempt
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: ID of the user
 *                 example: 1
 *               examId:
 *                 type: integer
 *                 nullable: false
 *                 description: ID of the exam
 *                 example: 2
 *     tags: [AI]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful response
 *       401:
 *         description: Unauthorized
 */
router.post('/start', authMiddleware, openAIController.startStudentAttempt)

/**
 * @swagger
 * /ai/{attemptId}/submit-answer:
 *   post:
 *     summary: Start Student Attempt
 *     description: Submit an answer for a specific student attempt
 *     parameters:
 *       - in: path
 *         name: attemptId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the attempt
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: ID of the user
 *                 example: 1
 *               QuestionId:
 *                 type: integer
 *                 description: ID of the question
 *                 example: 1
 *               SelectedOptionId:
 *                 type: integer
 *                 nullable: true
 *                 description: ID of the selected option (for multiple choice questions)
 *                 example: 2
 *               EssayAnswer:
 *                 type: string
 *                 nullable: true
 *                 description: Answer text for essay questions
 *                 example: "This is my essay answer."
 *     tags: [AI]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Answer submitted successfully
 *       400:
 *         description: Invalid input data
 *       404:
 *         description: Attempt not found
 */
router.post(
  '/:attemptId/submit-answer',
  authMiddleware,
  openAIController.submitStudentAnswer,
)

/**
 * @swagger
 * /ai/{attemptId}/finish:
 *   post:
 *     summary: finish Student Attempt
 *     parameters:
 *       - in: path
 *         name: attemptId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the attempt
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: ID of the user
 *                 example: 1
 *     tags: [AI]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description:need add code
 *       401:
 *         description: Unauthorized
 */
router.post(
  '/:attemptId/finish',
  authMiddleware,
  openAIController.finishStudentAnswer,
)

/**
 * @swagger
 * /ai/{attemptId}/result:
 *   get:
 *     summary: result Student Attempt
 *     parameters:
 *       - in: path
 *         name: attemptId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the attempt
 *       - in: query
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the user
 *     tags: [AI]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description:need add code
 *       401:
 *         description: Unauthorized
 */
router.get(
  '/:attemptId/result',
  authMiddleware,
  openAIController.resultStudentAnswer,
)
module.exports = router
