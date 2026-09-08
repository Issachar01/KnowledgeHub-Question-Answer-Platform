const express = require("express");

const {
  create,
  getAll,
  getOne,
  update,
  remove
} = require("../controllers/questionController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * /api/questions:
 *   get:
 *     summary: Get all questions
 *     tags: [Questions]
 *     responses:
 *       200:
 *         description: Questions retrieved successfully
 *       500:
 *         description: Internal server error
 */
router.get(
  "/",
  getAll
);

/**
 * @swagger
 * /api/questions/{id}:
 *   get:
 *     summary: Get a question by ID
 *     tags: [Questions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Question retrieved successfully
 *       400:
 *         description: Invalid question ID
 *       404:
 *         description: Question not found
 *       500:
 *         description: Internal server error
 */
router.get(
  "/:id",
  getOne
);

/**
 * @swagger
 * /api/questions:
 *   post:
 *     summary: Create a question
 *     description: Creates a new question for the authenticated user.
 *     tags: [Questions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 10
 *                 maxLength: 200
 *                 example: How do I use Prisma with PostgreSQL?
 *               description:
 *                 type: string
 *                 minLength: 20
 *                 maxLength: 10000
 *                 example: I am building a Node.js API and want to connect Prisma to PostgreSQL.
 *               tags:
 *                 type: array
 *                 maxItems: 5
 *                 items:
 *                   type: string
 *                 example:
 *                   - nodejs
 *                   - prisma
 *                   - postgresql
 *     responses:
 *       201:
 *         description: Question created successfully
 *       400:
 *         description: Validation failed
 *       401:
 *         description: Authentication required
 *       500:
 *         description: Internal server error
 */
router.post(
  "/",
  authMiddleware,
  create
);

/**
 * @swagger
 * /api/questions/{id}:
 *   patch:
 *     summary: Update own question
 *     description: Updates a question owned by the authenticated user.
 *     tags: [Questions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 10
 *                 maxLength: 200
 *                 example: Updated Prisma question title
 *               description:
 *                 type: string
 *                 minLength: 20
 *                 maxLength: 10000
 *                 example: Updated question description.
 *               tags:
 *                 type: array
 *                 maxItems: 5
 *                 items:
 *                   type: string
 *                 example:
 *                   - prisma
 *                   - postgresql
 *     responses:
 *       200:
 *         description: Question updated successfully
 *       400:
 *         description: Validation failed or invalid question ID
 *       401:
 *         description: Authentication required
 *       403:
 *         description: User is not authorized to update this question
 *       404:
 *         description: Question not found
 *       500:
 *         description: Internal server error
 */
router.patch(
  "/:id",
  authMiddleware,
  update
);

/**
 * @swagger
 * /api/questions/{id}:
 *   delete:
 *     summary: Delete own question
 *     description: Deletes a question owned by the authenticated user.
 *     tags: [Questions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Question deleted successfully
 *       400:
 *         description: Invalid question ID
 *       401:
 *         description: Authentication required
 *       403:
 *         description: User is not authorized to delete this question
 *       404:
 *         description: Question not found
 *       500:
 *         description: Internal server error
 */
router.delete(
  "/:id",
  authMiddleware,
  remove
);

module.exports = router;