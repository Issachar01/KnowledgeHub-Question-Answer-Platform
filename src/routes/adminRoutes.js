// src/routes/adminRoutes.js
// Branch: feature/admin-search

const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  toggleUserBlock,
  deleteInappropriateContent,
  getPlatformStats
} = require("../controllers/adminController");

// Safely require auth middleware and handle different possible export structures
const authModule = require("../middleware/authMiddleware");

const protect = authModule.protect || authModule;
const adminOnly = authModule.adminOnly || authModule.adminMiddleware;

if (typeof protect !== "function" || typeof adminOnly !== "function") {
  throw new Error("Middleware functions 'protect' and 'adminOnly' must be valid functions. Check your export structure in authMiddleware.js.");
}

router.use(protect, adminOnly);

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Get all users
 *     description: Returns all users on the platform. Admin access required.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin access required
 *       500:
 *         description: Internal server error
 */
router.get("/users", getAllUsers);

/**
 * @swagger
 * /api/admin/users/{id}/block:
 *   patch:
 *     summary: Block or unblock a user
 *     description: Toggles the blocked status of a user. Admin access required.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID
 *         schema:
 *           type: integer
 *         example: 5
 *     responses:
 *       200:
 *         description: User block status updated successfully
 *       400:
 *         description: Invalid user ID
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin access required
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.patch("/users/:id/block", toggleUserBlock);

/**
 * @swagger
 * /api/admin/content/{type}/{id}:
 *   delete:
 *     summary: Delete inappropriate content
 *     description: Deletes inappropriate platform content. Admin access required.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         description: Type of content to delete
 *         schema:
 *           type: string
 *           enum:
 *             - question
 *             - answer
 *             - comment
 *         example: question
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the content
 *         schema:
 *           type: integer
 *         example: 10
 *     responses:
 *       200:
 *         description: Content deleted successfully
 *       400:
 *         description: Invalid content type or ID
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Content not found
 *       500:
 *         description: Internal server error
 */
router.delete(
  "/content/:type/:id",
  deleteInappropriateContent
);

/**
 * @swagger
 * /api/admin/stats:
 *   get:
 *     summary: Get platform statistics
 *     description: Returns statistics about the KnowledgeHub platform. Admin access required.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Platform statistics retrieved successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin access required
 *       500:
 *         description: Internal server error
 */
router.get("/stats", getPlatformStats);

module.exports = router;