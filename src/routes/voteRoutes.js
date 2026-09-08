const express = require('express');
const router = express.Router();
const { castVote } = require('../controllers/voteController');
const authenticateToken = require('../middleware/authMiddleware');

router.post('/votes', authenticateToken, castVote);

module.exports = router;