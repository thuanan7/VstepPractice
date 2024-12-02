const express = require("express");
const questionController = require("../controllers/questionController");
const questionOptionController = require("../controllers/questionOptionController");

const router = express.Router();

// Question routes
router.get("/:sectionId/questions", questionController.getQuestions);
router.post("/questions", questionController.createQuestion);
router.put("/questions/:id", questionController.updateQuestion);
router.delete("/questions/:id", questionController.deleteQuestion);

// QuestionOption routes
router.get("/questions/:questionId/options", questionOptionController.getOptions);
router.post("/questions/options", questionOptionController.createOption);
router.put("/questions/options/:id", questionOptionController.updateOption);
router.delete("/questions/options/:id", questionOptionController.deleteOption);

module.exports = router;
