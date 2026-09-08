const {
  getUserProfile,
  getPublicUserProfile,
  updateUserProfile,
  uploadProfileImage,
  getLeaderboardUsers
} = require("../services/userService");

const {
  updateProfileSchema
} = require("../validators/userValidator");

const getProfile = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const user = await getUserProfile(userId);

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    if (error.message === "User not found") {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }

    next(error);
  }
};

const getPublicProfile = async (req, res, next) => {
  try {
    const userId = Number(req.params.id);

    if (!Number.isInteger(userId) || userId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID"
      });
    }

    const user = await getPublicUserProfile(userId);

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    if (error.message === "User not found") {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }

    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const validatedData = updateProfileSchema.parse(req.body);

    const userId = req.user.userId;

    const user = await updateUserProfile(
      userId,
      validatedData
    );

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
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

    next(error);
  }
};

const uploadProfile = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Profile image is required"
      });
    }

    const user = await uploadProfileImage(
      userId,
      req.file
    );

    res.status(200).json({
      success: true,
      message: "Profile image uploaded successfully",
      data: user
    });
  } catch (error) {
    next(error);
  }
};

const getLeaderboard = async (req, res, next) => {
  try {
    const users = await getLeaderboardUsers();

    res.status(200).json({
      success: true,
      data: users
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  getPublicProfile,
  updateProfile,
  uploadProfile,
  getLeaderboard
};