const express = require("express");

const {
  getAll,
  getOne,
  getByName
} = require("../controllers/tagController");

const router = express.Router();

// Get all tags
router.get("/", getAll);

// Get questions by tag name
router.get("/name/:name", getByName);

// Get one tag by ID
router.get("/:id", getOne);

module.exports = router;