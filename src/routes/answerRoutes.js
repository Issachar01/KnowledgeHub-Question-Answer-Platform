// src/routes/answerRoutes.js

const express = require('express');
const router = express.Router();
const { 
  createAnswer, 
  getAnswersByQuestion, 
  updateAnswer, 
  deleteAnswer 
} = require('../controllers/answerController');
const authenticateToken = require('../middleware/authMiddleware');

router.post('/questions/:questionId/answers', authenticateToken, createAnswer);
router.get('/questions/:questionId/answers', getAnswersByQuestion);
router.patch('/answers/:id', authenticateToken, updateAnswer);
router.delete('/answers/:id', authenticateToken, deleteAnswer);

module.exports = router;