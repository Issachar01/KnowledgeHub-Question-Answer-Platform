const prisma = require("../config/prisma");
const { generateRefreshToken } = require("../utils/refreshToken");

const REFRESH_TOKEN_EXPIRES_DAYS =
  Number(process.env.REFRESH_TOKEN_EXPIRES_DAYS) || 7;

const createRefreshToken = async (userId) => {
  const token = generateRefreshToken();

  const expiresAt = new Date();

  expiresAt.setDate(
    expiresAt.getDate() + REFRESH_TOKEN_EXPIRES_DAYS
  );

  const refreshToken = await prisma.refreshToken.create({
    data: {
      token,
      userId,
      expiresAt
    }
  });

  return refreshToken;
};

const getValidRefreshToken = async (token) => {
  const refreshToken = await prisma.refreshToken.findUnique({
    where: {
      token
    },
    include: {
      user: true
    }
  });

  if (!refreshToken) {
    throw new Error("Invalid refresh token");
  }

  if (refreshToken.expiresAt < new Date()) {
    await prisma.refreshToken.delete({
      where: {
        id: refreshToken.id
      }
    });

    throw new Error("Refresh token has expired");
  }

  return refreshToken;
};

const revokeRefreshToken = async (token) => {
  const refreshToken = await prisma.refreshToken.findUnique({
    where: {
      token
    }
  });

  if (!refreshToken) {
    throw new Error("Invalid refresh token");
  }

  await prisma.refreshToken.delete({
    where: {
      id: refreshToken.id
    }
  });
};

module.exports = {
  createRefreshToken,
  getValidRefreshToken,
  revokeRefreshToken
};