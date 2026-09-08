const express = require("express");

const {
  getProfile,
  getPublicProfile,
  updateProfile,
  uploadProfile
} = require("../controllers/userController");

const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Get logged-in user's profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *       401:
 *         description: Authentication required
 *       404:
 *         description: User not found
 */
router.get(
  "/profile",
  authMiddleware,
  getProfile
);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get a public user profile
 *     description: Returns publicly available information about a user.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Public user profile retrieved successfully
 *       400:
 *         description: Invalid user ID
 *       404:
 *         description: User not found
 */
router.get(
  "/:id",
  getPublicProfile
);

/**
 * @swagger
 * /api/users/profile:
 *   patch:
 *     summary: Update logged-in user's profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Saron Hailemeskel
 *               bio:
 *                 type: string
 *                 example: Computer Science student and backend developer.
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Validation failed
 *       401:
 *         description: Authentication required
 *       404:
 *         description: User not found
 */
router.patch(
  "/profile",
  authMiddleware,
  updateProfile
);

/**
 * @swagger
 * /api/users/profile/image:
 *   patch:
 *     summary: Upload profile image
 *     description: Uploads a profile image and stores it using Cloudinary.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - profileImage
 *             properties:
 *               profileImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Profile image uploaded successfully
 *       400:
 *         description: Invalid image
 *       401:
 *         description: Authentication required
 *       500:
 *         description: Image upload failed
 */
router.patch(
  "/profile/image",
  authMiddleware,
  upload.single("profileImage"),
  uploadProfile
);

module.exports = router;