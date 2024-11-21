const express = require('express')
const { body } = require('express-validator')
const {
  createListeningSectionPart,
  getSectionPartsByExamAndType,
} = require('../controllers/sectionPartControllers')
const {
  validateSectionPartRequest,
} = require('../middlewares/sectionPartMiddeware')

const sectionPartRouter = express.Router()

/**
 * @swagger
 * tags:
 *   name: SectionParts
 *   description: API for managing Section Parts
 */

/**
 * @swagger
 * /section-parts/listening:
 *   post:
 *     summary: Create a new Section Part for Listening
 *     tags: [SectionParts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - examId
 *               - type
 *             properties:
 *               examId:
 *                 type: integer
 *                 description: The ID of the exam
 *                 example: 1
 *               audioUrl:
 *                 type: string
 *                 enum: [listening, reading, writing, speaking]
 *                 description: The type of the section part
 *                 example: listening
 *               instructions:
 *                 type: string
 *                 description: Instructions for the section part
 *                 example: "Listen carefully to the audio and answer the questions."
 *     responses:
 *       201:
 *         description: Section part created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 123
 *                     examId:
 *                       type: integer
 *                       example: 101
 *                     type:
 *                       type: string
 *                       example: listening
 *                     instructions:
 *                       type: string
 *                       example: "Listen carefully to the audio and answer the questions."
 *                     orderNum:
 *                       type: integer
 *                       example: 1
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */

sectionPartRouter.post(
  '/listening',
  [
    body('examId').isInt().withMessage('Exam ID must be an integer'),
    body('instructions')
      .optional()
      .isString()
      .withMessage('Instructions must be a string'),
  ],
  createListeningSectionPart,
)

/**
 * @swagger
 * /section-parts:
 *   get:
 *     summary: Get Section Parts by Exam ID and Type
 *     tags: [SectionParts]
 *     parameters:
 *       - in: query
 *         name: examId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the exam
 *       - in: query
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [0, 1, 2, 3]
 *         description: Type of the section part (0- listening, 1- reading, 2- writing, 3- speaking)
 *     responses:
 *       200:
 *         description: List of section parts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       title:
 *                         type: string
 *                         example: "Listening Section Part 1"
 *                       instructions:
 *                         type: string
 *                         example: "Listen carefully to the audio and answer the questions."
 *                       content:
 *                         type: string
 *                         example: null
 *                       orderNum:
 *                         type: integer
 *                         example: 1
 *                       type:
 *                         type: string
 *                         example: listening
 *                       examId:
 *                         type: integer
 *                         example: 101
 *       400:
 *         description: Missing required parameters
 *       404:
 *         description: No section parts found
 *       500:
 *         description: Internal server error
 */
sectionPartRouter.get(
  '/',
  validateSectionPartRequest,
  getSectionPartsByExamAndType,
)

module.exports = sectionPartRouter
