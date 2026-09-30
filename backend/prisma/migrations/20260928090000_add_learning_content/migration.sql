-- CreateTable
CREATE TABLE "LearningContent" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "summary" TEXT,
    "readTime" TEXT NOT NULL DEFAULT '5 min read',
    "author" TEXT DEFAULT 'Aatmanirbhar Nari Mentorship Desk',
    "publishedDate" TEXT,
    "sections" JSONB,
    "keyTakeaways" JSONB,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LearningContent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LearningContent_slug_key" ON "LearningContent"("slug");

-- CreateIndex
CREATE INDEX "LearningContent_category_idx" ON "LearningContent"("category");

-- CreateIndex
CREATE INDEX "LearningContent_isPublished_idx" ON "LearningContent"("isPublished");
