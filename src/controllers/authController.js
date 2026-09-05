const {
  registerSchema,
  loginSchema
} = require("../validators/authValidator");

const {
  registerUser,
  loginUser
} = require("../services/authService");

const register = async (req, res) => {
  try {
    // Validate request body
    const validatedData = registerSchema.parse(req.body);

    // Create the user
    const user = await registerUser(validatedData);

    // Send successful response
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user
    });
  } catch (error) {
    console.error("Registration error:", error);

    // Handle Zod validation errors
    if (error.name === "ZodError") {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.issues
      });
    }

    // Handle duplicate email
    if (error.message === "Email is already registered") {
      return res.status(409).json({
        success: false,
        message: error.message
      });
    }

    // Handle unexpected errors
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};


//login 
const login = async (req, res) => {
  try {
    // Validate request body
    const validatedData = loginSchema.parse(req.body);

    // Authenticate user
    const user = await loginUser(validatedData);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: user
    });
  } catch (error) {
    console.error("Login error:", error);

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

    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};


module.exports = {
  register,
  login
};