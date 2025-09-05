-- CreateEnum
CREATE TYPE "public"."TodoStatus" AS ENUM ('TODO', 'IN_PROGRESS', 'DONE', 'BLOCKED');

-- CreateEnum
CREATE TYPE "public"."TodoPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- CreateTable
CREATE TABLE "public"."Todo" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "public"."TodoStatus" NOT NULL DEFAULT 'TODO',
    "priority" "public"."TodoPriority" NOT NULL DEFAULT 'MEDIUM',
    "startAt" TIMESTAMP(3),
    "dueAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Todo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Todo_status_priority_dueAt_idx" ON "public"."Todo"("status", "priority", "dueAt");

-- CreateIndex
CREATE INDEX "Todo_dueAt_idx" ON "public"."Todo"("dueAt");
