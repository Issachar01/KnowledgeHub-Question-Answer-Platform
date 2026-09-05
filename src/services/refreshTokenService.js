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

module.exports = {
  createRefreshToken
};