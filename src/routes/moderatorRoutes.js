// src/routes/moderatorRoutes.js

const express = require('express');
const router = express.Router();
const {
  getReports,
  updateReportStatus,
  removeInappropriateContent,
  suspendUser
} = require('../controllers/moderatorController');
const authenticateToken = require('../middleware/authMiddleware');
const verifyModerator = require('../middleware/moderatorMiddleware');

router.use(authenticateToken, verifyModerator);

/**
 * @swagger
 * /api/moderator/reports:
 *   get:
 *     summary: Get all content/user reports
 *     description: Retrieves all submitted platform reports for review by a moderator.
 *     tags: [Moderator]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Reports retrieved successfully
 *       403:
 *         description: Access denied (Moderator role required)
 */
router.get('/reports', getReports);

/**
 * @swagger
 * /api/moderator/reports/{reportId}:
 *   patch:
 *     summary: Update report status
 *     description: Marks a report as resolved or dismissed.
 *     tags: [Moderator]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reportId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PENDING, RESOLVED, DISMISSED]
 *     responses:
 *       200:
 *         description: Report updated successfully
 */
router.patch('/reports/:reportId', updateReportStatus);

/**
 * @swagger
 * /api/moderator/content/{contentType}/{contentId}:
 *   delete:
 *     summary: Delete inappropriate content
 *     description: Deletes a question, answer, or comment flagged by users.
 *     tags: [Moderator]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: contentType
 *         required: true
 *         schema:
 *           type: string
 *           enum: [QUESTION, ANSWER, COMMENT]
 *       - in: path
 *         name: contentId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Content deleted successfully
 */
router.delete('/content/:contentType/:contentId', removeInappropriateContent);

/**
 * @swagger
 * /api/moderator/users/{userId}/suspend:
 *   patch:
 *     summary: Suspend or block a user
 *     description: Blocks or unblocks a user account from accessing the platform.
 *     tags: [Moderator]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - isBanned
 *             properties:
 *               isBanned:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: User suspension status updated
 */
router.patch('/users/:userId/suspend', suspendUser);

module.exports = router;