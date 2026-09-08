// src/routes/voteRoutes.js

const express = require('express');
const router = express.Router();
const { voteOnQuestion, voteOnAnswer } = require('../controllers/voteController');
const authenticateToken = require('../middleware/authMiddleware');

/**
 * @swagger
 * /api/questions/{questionId}/votes:
 *   post:
 *     summary: Vote on a question
 *     description: Casts an upvote (1) or downvote (-1) on a specified question. If the vote already exists, it updates or removes it.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: questionId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the question to vote on
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - value
 *             properties:
 *               value:
 *                 type: integer
 *                 enum: [1, -1]
 *                 example: 1
 *     responses:
 *       200:
 *         description: Vote recorded successfully
 *       400:
 *         description: Invalid vote value or question not found
 *       401:
 *         description: Unauthorized token missing or invalid
 *       500:
 *         description: Internal server error
 */
router.post('/questions/:questionId/votes', authenticateToken, voteOnQuestion);

/**
 * @swagger
 * /api/answers/{answerId}/votes:
 *   post:
 *     summary: Vote on an answer
 *     description: Casts an upvote (1) or downvote (-1) on a specified answer.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: answerId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the answer to vote on
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - value
 *             properties:
 *               value:
 *                 type: integer
 *                 enum: [1, -1]
 *                 example: 1
 *     responses:
 *       200:
 *         description: Vote recorded successfully
 *       400:
 *         description: Invalid vote value or answer not found
 *       401:
 *         description: Unauthorized token missing or invalid
 *       500:
 *         description: Internal server error
 */
router.post('/answers/:answerId/votes', authenticateToken, voteOnAnswer);

module.exports = router;