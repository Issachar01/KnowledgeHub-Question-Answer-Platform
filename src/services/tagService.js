const prisma = require("../config/prisma");

// Get all tags
const getAllTags = async () => {
  const tags = await prisma.tag.findMany({
    orderBy: {
      name: "asc"
    },
    include: {
      _count: {
        select: {
          questionTags: true
        }
      }
    }
  });

  return tags;
};

// Get one tag by ID
const getTagById = async (tagId) => {
  const tag = await prisma.tag.findUnique({
    where: {
      id: tagId
    },
    include: {
      questionTags: {
        include: {
          question: {
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
          }
        }
      }
    }
  });

  if (!tag) {
    throw new Error("Tag not found");
  }

  return tag;
};

// Get questions by tag name
const getQuestionsByTagName = async (name) => {
  const normalizedName = name.trim().toLowerCase();

  const tag = await prisma.tag.findUnique({
    where: {
      name: normalizedName
    },
    include: {
      questionTags: {
        include: {
          question: {
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
          }
        }
      }
    }
  });

  if (!tag) {
    throw new Error("Tag not found");
  }

  return tag;
};

module.exports = {
  getAllTags,
  getTagById,
  getQuestionsByTagName
};