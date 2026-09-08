// src/services/searchService.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const searchPlatform = async (query) => {
  if (!query || query.trim() === "") {
    return { questions: [], users: [], answers: [], comments: [], tags: [] };
  }

  const searchTerm = query.trim();

  const [questions, users, answers, comments, tags] = await Promise.all([
    prisma.question.findMany({
      where: {
        OR: [
          { title: { contains: searchTerm, mode: "insensitive" } },
          { description: { contains: searchTerm, mode: "insensitive" } }
        ]
      },
      include: {
        author: { select: { id: true, name: true, profileImage: true } }
      },
      take: 10
    }),
    prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: searchTerm, mode: "insensitive" } },
          { email: { contains: searchTerm, mode: "insensitive" } }
        ]
      },
      select: {
        id: true,
        name: true,
        email: true,
        reputation: true,
        profileImage: true
      },
      take: 10
    }),
    prisma.answer.findMany({
      where: {
        content: { contains: searchTerm, mode: "insensitive" }
      },
      include: {
        author: { select: { id: true, name: true } },
        question: { select: { id: true, title: true } }
      },
      take: 10
    }),
    prisma.comment.findMany({
      where: {
        content: { contains: searchTerm, mode: "insensitive" }
      },
      take: 10
    }),
    prisma.tag.findMany({
      where: {
        name: { contains: searchTerm, mode: "insensitive" }
      },
      take: 10
    })
  ]);

  return {
    questions,
    users,
    answers,
    comments,
    tags
  };
};

module.exports = { searchPlatform };