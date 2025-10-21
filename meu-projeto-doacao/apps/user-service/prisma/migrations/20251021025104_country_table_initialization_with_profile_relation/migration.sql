/*
  Warnings:

  - You are about to drop the column `country` on the `user_profiles` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."user_profiles_country_idx";

-- AlterTable
ALTER TABLE "public"."user_profiles" DROP COLUMN "country",
ADD COLUMN     "country_code" TEXT;

-- CreateTable
CREATE TABLE "public"."Country" (
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Country_pkey" PRIMARY KEY ("code")
);

-- AddForeignKey
ALTER TABLE "public"."user_profiles" ADD CONSTRAINT "user_profiles_country_code_fkey" FOREIGN KEY ("country_code") REFERENCES "public"."Country"("code") ON DELETE SET NULL ON UPDATE CASCADE;
