const {
  registerSchema,
  loginSchema
} = require("../validators/authValidator");

const {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser
} = require("../services/authService");

const register = async (req, res, next) => {
  try {
    const validatedData = registerSchema.parse(req.body);

    const user = await registerUser(validatedData);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user
    });
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.issues
      });
    }

    if (error.message === "Email is already registered") {
      return res.status(409).json({
        success: false,
        message: error.message
      });
    }

    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const validatedData = loginSchema.parse(req.body);

    const user = await loginUser(validatedData);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: user
    });
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.issues
      });
    }

    if (error.message === "Invalid email or password") {
      return res.status(401).json({
        success: false,
        message: error.message
      });
    }

    next(error);
  }
};

const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: "Refresh token is required"
      });
    }

    const data = await refreshAccessToken(refreshToken);

    res.status(200).json({
      success: true,
      message: "Access token refreshed successfully",
      data
    });
  } catch (error) {
    if (
      error.message === "Invalid refresh token" ||
      error.message === "Refresh token has expired"
    ) {
      return res.status(401).json({
        success: false,
        message: error.message
      });
    }

    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: "Refresh token is required"
      });
    }

    await logoutUser(refreshToken);

    res.status(200).json({
      success: true,
      message: "Logout successful"
    });
  } catch (error) {
    if (error.message === "Invalid refresh token") {
      return res.status(401).json({
        success: false,
        message: error.message
      });
    }

    next(error);
  }
};

module.exports = {
  register,
  login,
  refresh,
  logout
};