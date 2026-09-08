const express = require('express');
const router = express.Router();
const {
  createComment,
  getQuestionComments,
  getAnswerComments,
  updateComment,
  deleteComment
} = require('../controllers/commentController');
const authenticateToken = require('../middleware/authMiddleware');

router.post('/questions/:questionId/comments', authenticateToken, createComment);
router.get('/questions/:questionId/comments', getQuestionComments);

router.post('/answers/:answerId/comments', authenticateToken, createComment);
router.get('/answers/:answerId/comments', getAnswerComments);

router.patch('/comments/:id', authenticateToken, updateComment);
router.delete('/comments/:id', authenticateToken, deleteComment);

module.exports = router;