/*
  Warnings:

  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `userID` on the `users` table. All the data in the column will be lost.
  - The required column `id` was added to the `users` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "public"."user_roles" DROP CONSTRAINT "user_roles_id_fkey";

-- DropIndex
DROP INDEX "public"."users_userID_idx";

-- AlterTable
ALTER TABLE "public"."users" DROP CONSTRAINT "users_pkey",
DROP COLUMN "userID",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "public"."user_profiles" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "avatar_s3_key" TEXT,
    "avatar_s3_url" TEXT,
    "bio" TEXT,
    "document_type" "public"."DocumentType",
    "document_number" TEXT,
    "country" TEXT DEFAULT 'BR',
    "total_donated" DECIMAL(20,8) NOT NULL DEFAULT 0.0,
    "total_received" DECIMAL(20,8) NOT NULL DEFAULT 0.0,
    "campaings_created" INTEGER NOT NULL DEFAULT 0,
    "donations_count" INTEGER NOT NULL DEFAULT 0,
    "meta_data" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_profiles_user_id_key" ON "public"."user_profiles"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_profiles_document_number_key" ON "public"."user_profiles"("document_number");

-- CreateIndex
CREATE INDEX "user_profiles_country_idx" ON "public"."user_profiles"("country");

-- CreateIndex
CREATE INDEX "user_profiles_document_number_idx" ON "public"."user_profiles"("document_number");

-- CreateIndex
CREATE INDEX "users_id_idx" ON "public"."users"("id");

-- AddForeignKey
ALTER TABLE "public"."user_roles" ADD CONSTRAINT "user_roles_id_fkey" FOREIGN KEY ("id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_profiles" ADD CONSTRAINT "user_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
