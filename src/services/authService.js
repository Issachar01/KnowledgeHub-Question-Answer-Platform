// src/services/authService.js
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const prisma = require("../config/prisma");
const { generateAccessToken } = require("../utils/jwt");
const {
  createRefreshToken,
  getValidRefreshToken,
  revokeRefreshToken
} = require("./refreshTokenService");
const { sendVerificationEmail } = require("./emailService");

const registerUser = async ({ name, email, password }) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      email
    }
  });

  if (existingUser) {
    throw new Error("Email is already registered");
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const verificationToken = crypto.randomBytes(32).toString("hex");

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      verificationToken
    },
    select: {
      id: true,
      name: true,
      email: true,
      bio: true,
      profileImage: true,
      role: true,
      reputation: true,
      createdAt: true
    }
  });

  await sendVerificationEmail(user.email, verificationToken);

  return user;
};

const loginUser = async ({ email, password }) => {
  const user = await prisma.user.findUnique({
    where: {
      email
    }
  });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  if (!user.isVerified) {
    throw new Error("Please verify your email before logging in");
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    throw new Error("Invalid email or password");
  }

  const accessToken = generateAccessToken(user);

  const refreshToken = await createRefreshToken(user.id);

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      bio: user.bio,
      profileImage: user.profileImage,
      role: user.role,
      reputation: user.reputation,
      createdAt: user.createdAt
    },
    accessToken,
    refreshToken: refreshToken.token
  };
};

const refreshAccessToken = async (token) => {
  const refreshToken = await getValidRefreshToken(token);

  const accessToken = generateAccessToken(refreshToken.user);

  return {
    accessToken
  };
};

const logoutUser = async (refreshToken) => {
  await revokeRefreshToken(refreshToken);
};

module.exports = {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser
};