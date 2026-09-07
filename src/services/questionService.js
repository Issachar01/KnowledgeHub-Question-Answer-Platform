const prisma = require("../config/prisma");

const createQuestion = async (userId, { title, description, tags = [] }) => {
  const question = await prisma.$transaction(
    async (tx) => {
      const createdQuestion = await tx.question.create({
        data: {
          title,
          description,
          authorId: userId
        }
      });

      const normalizedTags = [
        ...new Set(
          tags.map((tag) => tag.trim().toLowerCase())
        )
      ];

      for (const tagName of normalizedTags) {
        const tag = await tx.tag.upsert({
          where: {
            name: tagName
          },
          update: {},
          create: {
            name: tagName
          }
        });

        await tx.questionTag.create({
          data: {
            questionId: createdQuestion.id,
            tagId: tag.id
          }
        });
      }

      return tx.question.findUnique({
        where: {
          id: createdQuestion.id
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              profileImage: true,
              reputation: true
            }
          },
          questionTags: {
            include: {
              tag: true
            }
          }
        }
      });
    },
    {
      timeout: 10000
    }
  );

  return question;
};

const getAllQuestions = async () => {
  const questions = await prisma.question.findMany({
    orderBy: {
      createdAt: "desc"
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          profileImage: true,
          reputation: true
        }
      },
      questionTags: {
        include: {
          tag: true
        }
      },
      _count: {
        select: {
          answers: true,
          comments: true,
          votes: true
        }
      }
    }
  });

  return questions;
};

const getQuestionById = async (questionId) => {
  const question = await prisma.question.findUnique({
    where: {
      id: questionId
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          bio: true,
          profileImage: true,
          reputation: true
        }
      },
      questionTags: {
        include: {
          tag: true
        }
      },
      answers: {
        include: {
          author: {
            select: {
              id: true,
              name: true,
              profileImage: true,
              reputation: true
            }
          }
        },
        orderBy: {
          createdAt: "asc"
        }
      },
      comments: {
        include: {
          author: {
            select: {
              id: true,
              name: true,
              profileImage: true
            }
          }
        },
        orderBy: {
          createdAt: "asc"
        }
      },
      _count: {
        select: {
          answers: true,
          comments: true,
          votes: true
        }
      }
    }
  });

  if (!question) {
    throw new Error("Question not found");
  }

  return question;
};

const updateQuestion = async (questionId, userId, data) => {
  const existingQuestion = await prisma.question.findUnique({
    where: {
      id: questionId
    }
  });

  if (!existingQuestion) {
    throw new Error("Question not found");
  }

  if (existingQuestion.authorId !== userId) {
    throw new Error("You are not authorized to update this question");
  }

  const { title, description, tags } = data;

  const question = await prisma.$transaction(
    async (tx) => {
      await tx.question.update({
        where: {
          id: questionId
        },
        data: {
          ...(title !== undefined && { title }),
          ...(description !== undefined && { description })
        }
      });

      if (tags !== undefined) {
        await tx.questionTag.deleteMany({
          where: {
            questionId
          }
        });

        const normalizedTags = [
          ...new Set(
            tags.map((tag) => tag.trim().toLowerCase())
          )
        ];

        for (const tagName of normalizedTags) {
          const tag = await tx.tag.upsert({
            where: {
              name: tagName
            },
            update: {},
            create: {
              name: tagName
            }
          });

          await tx.questionTag.create({
            data: {
              questionId,
              tagId: tag.id
            }
          });
        }
      }

      return tx.question.findUnique({
        where: {
          id: questionId
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              profileImage: true,
              reputation: true
            }
          },
          questionTags: {
            include: {
              tag: true
            }
          }
        }
      });
    },
    {
      timeout: 20000
    }
  );

  return question;
};

const deleteQuestion = async (questionId, userId) => {
  const existingQuestion = await prisma.question.findUnique({
    where: {
      id: questionId
    }
  });

  if (!existingQuestion) {
    throw new Error("Question not found");
  }

  if (existingQuestion.authorId !== userId) {
    throw new Error("You are not authorized to delete this question");
  }

  await prisma.question.delete({
    where: {
      id: questionId
    }
  });

  return true;
};

module.exports = {
  createQuestion,
  getAllQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestion
};