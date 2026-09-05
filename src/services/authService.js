const bcrypt = require("bcrypt");
const prisma = require("../config/prisma");

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

module.exports = {
  registerUser
};