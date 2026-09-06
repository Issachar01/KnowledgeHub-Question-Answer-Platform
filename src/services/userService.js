const prisma = require("../config/prisma");

const cloudinary = require("../config/cloudinary");

const getUserProfile = async (userId) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId
    },
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

const updateUserProfile = async (userId, data) => {
  const user = await prisma.user.update({
    where: {
      id: userId
    },
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
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    uploadStream.end(file.buffer);
  });

  const user = await prisma.user.update({
    where: {
      id: userId
    },
    data: {
      profileImage: uploadResult.secure_url
    },
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

module.exports = {
  getUserProfile,
  updateUserProfile,
  uploadProfileImage
};