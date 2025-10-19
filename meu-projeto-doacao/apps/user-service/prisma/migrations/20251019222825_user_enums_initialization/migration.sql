-- CreateEnum
CREATE TYPE "public"."UserStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING_VERIFICATION', 'BLOCKED');

-- CreateEnum
CREATE TYPE "public"."DocumentType" AS ENUM ('CPF', 'CNPJ', 'PASSPORT', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."VerificationStatus" AS ENUM ('PENDING', 'SUBMITTED', 'REVIEWING', 'APPROVED', 'REJECTED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "public"."WalletProvider" AS ENUM ('METAMASK', 'WALLET_CONNECT', 'COINBASE_WALLET', 'TRUST_WALLET', 'PHANTOM', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."BlockchainNetwork" AS ENUM ('ETHEREUM_MAINNET', 'ETHEREUM_SEPOLIA', 'POLYGON', 'BSC', 'ARBITRUM', 'OPTIMISM', 'SOLANA', 'BASE');

-- CreateEnum
CREATE TYPE "public"."RoleType" AS ENUM ('USER', 'DONOR', 'FUNDRAISER', 'MODERATOR', 'ADMIN');

-- CreateEnum
CREATE TYPE "public"."UserReputation" AS ENUM ('TRUSTED', 'GOOD', 'NEUTRAL', 'WARNING', 'DANGEROUS');
