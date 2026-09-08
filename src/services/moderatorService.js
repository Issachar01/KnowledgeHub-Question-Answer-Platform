// src/services/moderatorService.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAllReports = async () => {
  return await prisma.report.findMany({
    include: {
      reporter: { select: { id: true, name: true, email: true } },
      reportedUser: { select: { id: true, name: true, email: true } }
    },
    orderBy: { createdAt: 'desc' }
  });
};

const updateReportStatus = async (reportId, status) => {
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

const suspendUser = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: parseInt(userId) }
  });

  if (!user) {
    throw new Error('User not found');
  }

  return await prisma.user.update({
    where: { id: parseInt(userId) },
    data: { isBanned: !user.isBanned },
    select: { id: true, name: true, email: true, isBanned: true }
  });
};

const deleteContent = async (contentType, contentId) => {
  const type = contentType.toUpperCase();
  const id = parseInt(contentId);

  if (type === 'QUESTION') {
    return await prisma.question.delete({ where: { id } });
  } else if (type === 'ANSWER') {
    return await prisma.answer.delete({ where: { id } });
  } else if (type === 'COMMENT') {
    return await prisma.comment.delete({ where: { id } });
  } else {
    throw new Error('Invalid content type');
  }
};

module.exports = {
  getAllReports,
  updateReportStatus,
  suspendUser,
  deleteContent
};