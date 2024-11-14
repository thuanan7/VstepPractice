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
module.exports = router
