// src/services/moderatorService.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getReports = async () => {
  return await prisma.report.findMany({
    include: {
      reporter: { select: { id: true, name: true, email: true } },
      reportedUser: { select: { id: true, name: true, email: true } }
    },
    orderBy: { createdAt: 'desc' }
  });
};

const resolveReport = async (reportId, status) => {
  const report = await prisma.report.findUnique({
    where: { id: parseInt(reportId) }
  });

  if (!report) {
    throw new Error('Report not found');
  }

  return await prisma.report.update({
    where: { id: parseInt(reportId) },
    data: { status }
  });
};

const toggleUserSuspension = async (userId, isBanned) => {
  const user = await prisma.user.findUnique({
    where: { id: parseInt(userId) }
  });

  if (!user) {
    throw new Error('User not found');
  }

  const targetStatus = isBanned !== undefined ? isBanned : !user.isBanned;

  return await prisma.user.update({
    where: { id: parseInt(userId) },
    data: { isBanned: targetStatus },
    select: { id: true, name: true, email: true, isBanned: true }
  });
};

const deleteContent = async (contentType, contentId) => {
  const type = contentType.toUpperCase();
  const id = parseInt(contentId);

  if (type === 'QUESTION' || type === 'QUESTIONS') {
    return await prisma.question.delete({ where: { id } });
  } else if (type === 'ANSWER' || type === 'ANSWERS') {
    return await prisma.answer.delete({ where: { id } });
  } else if (type === 'COMMENT' || type === 'COMMENTS') {
    return await prisma.comment.delete({ where: { id } });
  } else {
    throw new Error('Invalid content type');
  }
};

module.exports = {
  getReports,
  resolveReport,
  toggleUserSuspension,
  deleteContent
};