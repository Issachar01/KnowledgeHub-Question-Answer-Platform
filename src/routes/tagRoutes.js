const express = require("express");

const {
  getAll,
  getOne,
  getByName
} = require("../controllers/tagController");

const router = express.Router();

/**
 * @swagger
 * /api/tags:
 *   get:
 *     summary: Get all tags
 *     tags: [Tags]
 *     responses:
 *       200:
 *         description: Tags retrieved successfully
 *       500:
 *         description: Internal server error
 */
router.get(
  "/",
  getAll
);

/**
 * @swagger
 * /api/tags/name/{name}:
 *   get:
 *     summary: Get questions by tag name
 *     description: Returns a tag and the questions associated with it.
 *     tags: [Tags]
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         example: javascript
 *     responses:
 *       200:
 *         description: Tag and associated questions retrieved successfully
 *       404:
 *         description: Tag not found
 *       500:
 *         description: Internal server error
 */
router.get(
  "/name/:name",
  getByName
);

/**
 * @swagger
 * /api/tags/{id}:
 *   get:
 *     summary: Get a tag by ID
 *     tags: [Tags]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Tag retrieved successfully
 *       400:
 *         description: Invalid tag ID
 *       404:
 *         description: Tag not found
 *       500:
 *         description: Internal server error
 */
router.get(
  "/:id",
  getOne
);

module.exports = router;