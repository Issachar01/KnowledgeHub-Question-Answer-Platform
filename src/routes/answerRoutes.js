// src/routes/answerRoutes.js

const express = require('express');
const router = express.Router();
const { 
  createAnswer, 
  getAnswersByQuestion, 
  updateAnswer, 
  deleteAnswer,
  toggleAcceptAnswer 
} = require('../controllers/answerController');
const authenticateToken = require('../middleware/authMiddleware');

/**
 * @swagger
 * /api/questions/{questionId}/answers:
 *   post:
 *     summary: Create a new answer
 *     description: Posts an answer to a specific question. Requires authentication.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: questionId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the question being answered
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 example: "You can implement this using Prisma transactions."
 *     responses:
 *       201:
 *         description: Answer created successfully
 *       400:
 *         description: Question not found or validation error
 *       401:
 *         description: Unauthorized token missing or invalid
 *       500:
 *         description: Internal server error
 *   get:
 *     summary: Get all answers for a question
 *     description: Retrieves a list of all answers associated with a specific question.
 *     parameters:
 *       - in: path
 *         name: questionId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the question
 *     responses:
 *       200:
 *         description: List of answers retrieved successfully
 *       500:
 *         description: Internal server error
 */
router.post('/questions/:questionId/answers', authenticateToken, createAnswer);
router.get('/questions/:questionId/answers', getAnswersByQuestion);

/**
 * @swagger
 * /api/answers/{id}:
 *   patch:
 *     summary: Update an answer
 *     description: Updates the content of an existing answer. Only the author can update it.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the answer to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 example: "Updated answer content here."
 *     responses:
 *       200:
 *         description: Answer updated successfully
 *       400:
 *         description: Answer not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Not the author)
 *       500:
 *         description: Internal server error
 *   delete:
 *     summary: Delete an answer
 *     description: Deletes an existing answer. Only the author can delete it.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the answer to delete
 *     responses:
 *       200:
 *         description: Answer deleted successfully
 *       400:
 *         description: Answer not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Not the author)
 *       500:
 *         description: Internal server error
 */
router.patch('/answers/:id', authenticateToken, updateAnswer);
router.delete('/answers/:id', authenticateToken, deleteAnswer);

/**
 * @swagger
 * /api/answers/{id}/accept:
 *   patch:
 *     summary: Toggle accepted status of an answer
 *     description: Marks or unmarks an answer as accepted. Only the author of the parent question can perform this action.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the answer
 *     responses:
 *       200:
 *         description: Answer acceptance status toggled successfully
 *       400:
 *         description: Answer not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Only the question author can accept an answer
 *       500:
 *         description: Internal server error
 */
router.patch('/answers/:id/accept', authenticateToken, toggleAcceptAnswer);

module.exports = router;