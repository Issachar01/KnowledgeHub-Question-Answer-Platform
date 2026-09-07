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

// Get all questions
router.get(
  "/",
  getAll
);

// Get one question
router.get(
  "/:id",
  getOne
);

// Create question
// Authentication required
router.post(
  "/",
  authMiddleware,
  create
);

// Update own question
// Authentication required
router.patch(
  "/:id",
  authMiddleware,
  update
);

// Delete own question
// Authentication required
router.delete(
  "/:id",
  authMiddleware,
  remove
);

module.exports = router;