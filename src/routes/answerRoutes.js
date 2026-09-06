// routes/answerRoutes.js (Branch: feature/answers)
const express = require('express');
const router = express.Router({ mergeParams: true });
const { 
  createAnswer, 
  getAnswersByQuestion, 
  updateAnswer, 
  deleteAnswer 
} = require('../controllers/answerController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(getAnswersByQuestion)
  .post(protect, createAnswer);

router.route('/:id')
  .put(protect, updateAnswer)
  .delete(protect, deleteAnswer);

module.exports = router;
