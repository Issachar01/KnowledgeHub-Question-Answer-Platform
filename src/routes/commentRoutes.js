// src/routes/commentRoutes.js

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

/**
 * @swagger
 * /api/questions/{questionId}/comments:
 *   post:
 *     summary: Add a comment to a question
 *     description: Creates a new comment under a specific question.
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: questionId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the question
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
 *                 example: "Could you clarify this part?"
 *     responses:
 *       201:
 *         description: Comment created successfully
 *       400:
 *         description: Validation error or question not found
 *       401:
 *         description: Unauthorized token missing or invalid
 *       500:
 *         description: Internal server error
 *   get:
 *     summary: Get comments for a question
 *     description: Retrieves all comments associated with a specific question.
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: questionId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the question
 *     responses:
 *       200:
 *         description: Comments retrieved successfully
 *       500:
 *         description: Internal server error
 */
router.post('/questions/:questionId/comments', authenticateToken, createComment);
router.get('/questions/:questionId/comments', getQuestionComments);

/**
 * @swagger
 * /api/answers/{answerId}/comments:
 *   post:
 *     summary: Add a comment to an answer
 *     description: Creates a new comment under a specific answer.
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: answerId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the answer
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
 *                 example: "Thanks, this helped a lot!"
 *     responses:
 *       201:
 *         description: Comment created successfully
 *       400:
 *         description: Validation error or answer not found
 *       401:
 *         description: Unauthorized token missing or invalid
 *       500:
 *         description: Internal server error
 *   get:
 *     summary: Get comments for an answer
 *     description: Retrieves all comments associated with a specific answer.
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: answerId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the answer
 *     responses:
 *       200:
 *         description: Comments retrieved successfully
 *       500:
 *         description: Internal server error
 */
router.post('/answers/:answerId/comments', authenticateToken, createComment);
router.get('/answers/:answerId/comments', getAnswerComments);

/**
 * @swagger
 * /api/comments/{id}:
 *   patch:
 *     summary: Update a comment
 *     description: Updates the content of an existing comment. Only the original author can edit it.
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the comment
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
 *                 example: "Updated comment text."
 *     responses:
 *       200:
 *         description: Comment updated successfully
 *       400:
 *         description: Comment not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Not the comment author)
 *       500:
 *         description: Internal server error
 *   delete:
 *     summary: Delete a comment
 *     description: Deletes an existing comment. Only the original author can delete it.
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the comment
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *       400:
 *         description: Comment not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Not the comment author)
 *       500:
 *         description: Internal server error
 */
router.patch('/comments/:id', authenticateToken, updateComment);
router.delete('/comments/:id', authenticateToken, deleteComment);

module.exports = router;