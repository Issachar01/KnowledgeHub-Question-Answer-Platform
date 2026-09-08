// src/services/questionService.js (Pagination & Sorting update)
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getAllQuestions = async (queryParams) => {
  const page = parseInt(queryParams.page, 10) || 1;
  const limit = parseInt(queryParams.limit, 10) || 10;
  const skip = (page - 1) * limit;
  const sortBy = queryParams.sortBy || "newest"; // 'newest', 'oldest'

  let orderBy = { createdAt: "desc" };
  if (sortBy === "oldest") {
    orderBy = { createdAt: "asc" };
  }

  const [questions, total] = await Promise.all([
    prisma.question.findMany({
      skip,
      take: limit,
      orderBy,
      include: {
        author: { select: { id: true, name: true, profileImage: true } },
        questionTags: { include: { tag: true } },
        _count: { select: { answers: true, votes: true } }
      }
    }),
    prisma.question.count()
  ]);

  return {
    success: true,
    data: questions,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
};

module.exports = {
  getAllQuestions
};