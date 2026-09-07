const { z } = require("zod");

const createQuestionSchema = z.object({
  title: z
    .string()
    .min(10, "Title must be at least 10 characters long")
    .max(200, "Title must not exceed 200 characters"),

  description: z
    .string()
    .min(20, "Description must be at least 20 characters long")
    .max(10000, "Description must not exceed 10000 characters"),

  tags: z
    .array(
      z
        .string()
        .min(1, "Tag cannot be empty")
        .max(30, "Tag must not exceed 30 characters")
    )
    .max(5, "A question can have a maximum of 5 tags")
    .optional()
    .default([])
});

const updateQuestionSchema = z
  .object({
    title: z
      .string()
      .min(10, "Title must be at least 10 characters long")
      .max(200, "Title must not exceed 200 characters")
      .optional(),

    description: z
      .string()
      .min(20, "Description must be at least 20 characters long")
      .max(10000, "Description must not exceed 10000 characters")
      .optional(),

    tags: z
      .array(
        z
          .string()
          .min(1, "Tag cannot be empty")
          .max(30, "Tag must not exceed 30 characters")
      )
      .max(5, "A question can have a maximum of 5 tags")
      .optional()
  })
  .refine(
    (data) =>
      data.title !== undefined ||
      data.description !== undefined ||
      data.tags !== undefined,
    {
      message: "At least one field is required"
    }
  );

module.exports = {
  createQuestionSchema,
  updateQuestionSchema
};