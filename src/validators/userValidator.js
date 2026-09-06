const { z } = require("zod");

const updateProfileSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters long")
      .max(50, "Name must not exceed 50 characters")
      .optional(),

    bio: z
      .string()
      .max(500, "Bio must not exceed 500 characters")
      .optional()
  })
  .refine(
    (data) => data.name !== undefined || data.bio !== undefined,
    {
      message: "At least one field is required"
    }
  );

module.exports = {
  updateProfileSchema
};