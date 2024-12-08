const express = require('express')
const { body, validationResult } = require('express-validator')
const {
  createListeningSectionPart,
  getSectionParts,
  createSectionPart,
  updateSectionPart,
  deleteSectionPart,
  getParts,
  createPart,
  updatePart,
  deletePart,
} = require('../controllers/sectionPartControllers')

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

sectionPartRouter.get('/:id', getSectionParts)
sectionPartRouter.post('/', createSectionPart)
sectionPartRouter.put('/:id', updateSectionPart)
sectionPartRouter.delete('/:id', deleteSectionPart)
sectionPartRouter.get('/:parentId/children', getParts)
sectionPartRouter.post('/:parentId/children', createPart)
sectionPartRouter.put('/:id', updatePart)
sectionPartRouter.delete('/:id', deletePart)

module.exports = sectionPartRouter
