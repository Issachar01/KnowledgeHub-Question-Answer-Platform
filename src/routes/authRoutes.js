const express = require("express");

const {
  register,
  login
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

// Protected test endpoint
router.get("/me", authMiddleware, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Authenticated user",
    data: {
      userId: req.user.userId,
      role: req.user.role
    }
  });
});

module.exports = router;