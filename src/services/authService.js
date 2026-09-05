const bcrypt = require("bcrypt");
const prisma = require("../config/prisma");
//jwt token
const { generateAccessToken } = require("../utils/jwt");
//refresh token
const { createRefreshToken } = require("./refreshTokenService");

const registerUser = async ({ name, email, password }) => {
  // 1. Check if the email already exists
  const existingUser = await prisma.user.findUnique({
    where: {
      email
    }
  });

  if (existingUser) {
    throw new Error("Email is already registered");
  }

  // 2. Hash the password
  const hashedPassword = await bcrypt.hash(password, 12);

  // 3. Create the user
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword
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
module.exports = {
  registerUser,
  loginUser
};