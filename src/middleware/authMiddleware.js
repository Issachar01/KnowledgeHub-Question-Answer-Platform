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

module.exports = authMiddleware;