// src/routes/voteRoutes.js

const express = require('express');
const router = express.Router();
const { voteOnQuestion, voteOnAnswer } = require('../controllers/voteController');
const authenticateToken = require('../middleware/authMiddleware');

router.post('/questions/:questionId/votes', authenticateToken, voteOnQuestion);
router.post('/answers/:answerId/votes', authenticateToken, voteOnAnswer);

module.exports = router;