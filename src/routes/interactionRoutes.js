// routes/interactionRoutes.js (Branch: feature/voting-and-accept)
const express = require('express');
const router = express.Router();
const { voteItem, acceptAnswer } = require('../controllers/interactionController');
const { protect } = require('../middleware/authMiddleware');

router.post('/questions/:id/vote', protect, voteItem);
router.post('/answers/:id/vote', protect, voteItem);
router.patch('/answers/:answerId/accept', protect, acceptAnswer);

module.exports = router;
