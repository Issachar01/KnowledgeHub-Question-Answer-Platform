// src/middleware/authMiddleware.js
const { verifyAccessToken } = require("../utils/jwt");

const authMiddleware = (req, res, next) => {
  try {
    // Get the Authorization header
    const authHeader = req.headers.authorization;

    // Check if Authorization header exists
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }

    // Check Bearer format
    const parts = authHeader.split(" ");

    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return res.status(401).json({
        success: false,
        message: "Invalid authorization format"
      });
    }

    const token = parts[1];

    // Verify the JWT
    const decoded = verifyAccessToken(token);

    // Attach authenticated user information to request
    req.user = decoded;

    // Continue to the next middleware/controller
    next();
  } catch (error) {
    console.error("Authentication error:", error);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token"
    });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "ADMIN") {
    return next();
  }
  return res.status(403).json({
    success: false,
    message: "Access denied. Admin privileges required."
  });
};

// Dual-compatibility export:
// 1. Works when required directly as a function (e.g. const authMiddleware = require(...))
// 2. Works when destructured as properties (e.g. const { protect, adminOnly } = require(...))
authMiddleware.protect = authMiddleware;
authMiddleware.adminOnly = adminOnly;
authMiddleware.authMiddleware = authMiddleware;

module.exports = authMiddleware;