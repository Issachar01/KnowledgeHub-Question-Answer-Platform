const prisma = require("../config/prisma");
const cloudinary = require("../config/cloudinary");

const getUserProfile = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      bio: true,
      profileImage: true,
      role: true,
      reputation: true,
      createdAt: true,
      updatedAt: true
    }
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

const getPublicUserProfile = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      bio: true,
      profileImage: true,
      reputation: true,
      createdAt: true
    }
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

const updateUserProfile = async (userId, data) => {
  const user = await prisma.user.update({
    where: { id: userId },
    data,
    select: {
      id: true,
      name: true,
      email: true,
      bio: true,
      profileImage: true,
      role: true,
      reputation: true,
      createdAt: true,
      updatedAt: true
    }
  });

  return user;
};

const uploadProfileImage = async (userId, file) => {
  if (!file) {
    throw new Error("Profile image is required");
  }

  const uploadResult = await new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "knowledgehub/profiles",
        resource_type: "image"
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    uploadStream.end(file.buffer);
  });

  const user = await prisma.user.update({
    where: { id: userId },
    data: { profileImage: uploadResult.secure_url },
    select: {
      id: true,
      name: true,
      email: true,
      bio: true,
      profileImage: true,
      role: true,
      reputation: true,
      createdAt: true,
      updatedAt: true
    }
  });

  return user;
};

const getLeaderboardUsers = async (limit = 10) => {
  const users = await prisma.user.findMany({
    take: limit,
    orderBy: {
      reputation: 'desc'
    },
    select: {
      id: true,
      name: true,
      bio: true,
      profileImage: true,
      reputation: true,
      createdAt: true
    }
  });

  return users;
};

module.exports = {
  getUserProfile,
  getPublicUserProfile,
  updateUserProfile,
  uploadProfileImage,
  getLeaderboardUsers
};