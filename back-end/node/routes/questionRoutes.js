const express = require('express')
const questionController = require('../controllers/questionController')
const questionOptionController = require('../controllers/questionOptionController')

const router = express.Router()

router.post('/', questionController.createEmptyQuestion)
router.delete('/:id', questionController.removeQuestion)
router.put('/:id', questionController.updateQuestion)
router.post('/option', questionOptionController.createEmptyOption)
router.delete('/option/:id', questionOptionController.removeOption)
router.put('/:id/options', questionOptionController.updateOptions)
module.exports = router
