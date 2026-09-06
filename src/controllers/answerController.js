const createAnswer = async (req, res, next) => {
  try {
    const questionId = parseInt(req.params.questionId);
    const { content } = req.body;
    const userId = req.user.id; // ensure your auth middleware assigns numeric user id

    const question = await prisma.question.findUnique({
      where: { id: questionId },
      include: { author: true }
    });

    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    const answer = await prisma.answer.create({
      data: { content, questionId, authorId: userId }
    });

    await prisma.user.update({
      where: { id: userId },
      data: { reputation: { increment: 10 } }
    });

    if (question.author.email && question.authorId !== userId) {
      await sendEmail({
        email: question.author.email,
        subject: 'New Answer on Your Question',
        message: `Hello ${question.author.name}, someone answered your question "${question.title}".`
      });
    }

    res.status(201).json({ success: true, data: answer });
  } catch (error) {
    next(error);
  }
};