'use strict';
const express = require('express');
const router = express.Router();
const examController = require('../controllers/examController');
router.get('/', examController.getAllExam)
module.exports = router;
