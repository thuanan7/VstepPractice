'use strict'
const express = require('express')
const router = express.Router()
const openAIController = require('../controllers/openAIController')

router.get('/test', openAIController.testConnection)
