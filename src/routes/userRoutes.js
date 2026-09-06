const express = require("express");

const {
  getProfile,
  updateProfile,
  uploadProfile
} = require("../controllers/userController");

const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// Get logged-in user's profile
router.get(
  "/profile",
  authMiddleware,
  getProfile
);

// Update logged-in user's profile
router.patch(
  "/profile",
  authMiddleware,
  updateProfile
);

// Upload profile image
router.patch(
  "/profile/image",
  authMiddleware,
  upload.single("profileImage"),
  uploadProfile
);

module.exports = router;