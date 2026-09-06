const getFilteredQuestions = async (req, res, next) => {
  try {
    const { search, page = 1, limit = 10, sort = 'newest' } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    let whereClause = {};
    if (search) {
      whereClause = {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { questionTags: { some: { tag: { name: { contains: search, mode: 'insensitive' } } } } }
        ]
      };
    }

    let orderBy = { createdAt: 'desc' };
    if (sort === 'popular') {
      orderBy = { votes: { _count: 'desc' } };
    } else if (sort === 'unanswered') {
      whereClause.answers = { none: {} };
    }

    const [questions, total] = await Promise.all([
      prisma.question.findMany({
        where: whereClause,
        skip,
        take: parseInt(limit),
        orderBy,
        include: {
          author: { select: { id: true, name: true, profileImage: true } },
          questionTags: { include: { tag: true } },
          _count: { select: { answers: true, votes: true } }
        }
      }),
      prisma.question.count({ where: whereClause })
    ]);

    res.status(200).json({
      success: true,
      data: questions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    next(error);
  }
};