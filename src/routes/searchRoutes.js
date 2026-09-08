// src/routes/searchRoutes.js
const express = require("express");
const router = express.Router();
const { globalSearch } = require("../controllers/searchController");

/**
 * @swagger
 * /api/search:
 *   get:
 *     summary: Global platform search
 *     description: Searches across questions, users, answers, and comments.
 *     tags: [Search]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Search keyword
 *     responses:
 *       200:
 *         description: Search results retrieved successfully
 *       400:
 *         description: Missing query parameter
 *       500:
 *         description: Internal server error
 */
router.get("/", globalSearch);

module.exports = router;