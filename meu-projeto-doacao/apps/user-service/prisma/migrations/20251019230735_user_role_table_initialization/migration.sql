/*
  Warnings:

  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `users` table. All the data in the column will be lost.
  - The required column `userID` was added to the `users` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- CreateEnum
CREATE TYPE "public"."RoleType" AS ENUM ('USER', 'DONOR', 'FUNDRAISER', 'MODERATOR', 'ADMIN');

-- AlterTable
ALTER TABLE "public"."users" DROP CONSTRAINT "users_pkey",
DROP COLUMN "id",
ADD COLUMN     "userID" TEXT NOT NULL,
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("userID");

-- CreateTable
CREATE TABLE "public"."user_roles" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "role" "public"."RoleType" NOT NULL,
    "assigned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assigned_by" TEXT,

    CONSTRAINT "user_roles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "user_roles_user_id_idx" ON "public"."user_roles"("user_id");

-- CreateIndex
CREATE INDEX "user_roles_role_idx" ON "public"."user_roles"("role");

-- CreateIndex
CREATE UNIQUE INDEX "user_roles_user_id_role_key" ON "public"."user_roles"("user_id", "role");

-- CreateIndex
CREATE INDEX "users_status_idx" ON "public"."users"("status");

-- CreateIndex
CREATE INDEX "users_userID_idx" ON "public"."users"("userID");

-- CreateIndex
CREATE INDEX "users_reputation_score_idx" ON "public"."users"("reputation_score");

-- CreateIndex
CREATE INDEX "users_created_at_idx" ON "public"."users"("created_at");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "public"."users"("email");

-- AddForeignKey
ALTER TABLE "public"."user_roles" ADD CONSTRAINT "user_roles_id_fkey" FOREIGN KEY ("id") REFERENCES "public"."users"("userID") ON DELETE CASCADE ON UPDATE CASCADE;
