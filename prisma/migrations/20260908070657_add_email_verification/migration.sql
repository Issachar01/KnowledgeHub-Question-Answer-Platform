-- AlterTable
ALTER TABLE "User"
ADD COLUMN "isVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "verificationToken" TEXT;

-- Prevent multiple accepted answers for the same question
CREATE UNIQUE INDEX "one_accepted_answer_per_question"
ON "Answer" ("questionId")
WHERE "isAccepted" = true;

-- A comment must belong to exactly one target
ALTER TABLE "Comment"
ADD CONSTRAINT "comment_exactly_one_target"
CHECK (
  ("questionId" IS NOT NULL AND "answerId" IS NULL)
  OR
  ("questionId" IS NULL AND "answerId" IS NOT NULL)
);