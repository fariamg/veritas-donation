-- CreateTable
CREATE TABLE "public"."user_wallets" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "wallet_address" TEXT NOT NULL,
    "wallet_provider" "public"."WalletProvider" NOT NULL,
    "blockchain_network" "public"."BlockchainNetwork" NOT NULL,
    "added_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_wallets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "user_wallets_user_id_idx" ON "public"."user_wallets"("user_id");

-- CreateIndex
CREATE INDEX "user_wallets_wallet_address_idx" ON "public"."user_wallets"("wallet_address");

-- CreateIndex
CREATE UNIQUE INDEX "user_wallets_user_id_wallet_address_blockchain_network_key" ON "public"."user_wallets"("user_id", "wallet_address", "blockchain_network");

-- CreateIndex
CREATE INDEX "user_profiles_country_code_idx" ON "public"."user_profiles"("country_code");

-- AddForeignKey
ALTER TABLE "public"."user_wallets" ADD CONSTRAINT "user_wallets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
