-- CreateEnum
CREATE TYPE "VoteBatchStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "PartyCode" AS ENUM ('PSD', 'PS', 'IL', 'CH', 'PAN', 'L', 'BE');

-- CreateTable
CREATE TABLE "VoteBatches" (
    "id" TEXT NOT NULL,
    "total_rows" INTEGER NOT NULL,
    "error_message" TEXT,
    "error_count" INTEGER NOT NULL DEFAULT 0,
    "status" "VoteBatchStatus" NOT NULL DEFAULT 'PENDING',
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at_ms" DOUBLE PRECISION,

    CONSTRAINT "VoteBatches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VoteHistories" (
    "id" TEXT NOT NULL,
    "district_id" TEXT NOT NULL,
    "party_id" TEXT NOT NULL,
    "vote_count" INTEGER NOT NULL,
    "vote_batch_id" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VoteHistories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Votes" (
    "id" TEXT NOT NULL,
    "party_id" TEXT NOT NULL,
    "district_id" TEXT NOT NULL,
    "total_vote_count" INTEGER NOT NULL,
    "last_vote_history_id" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Votes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Parties" (
    "id" TEXT NOT NULL,
    "code" "PartyCode" NOT NULL,
    "name" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Parties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Districts" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "total_vote_count" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Districts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Votes_party_id_district_id_key" ON "Votes"("party_id", "district_id");

-- CreateIndex
CREATE UNIQUE INDEX "Parties_code_key" ON "Parties"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Parties_name_key" ON "Parties"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Districts_name_key" ON "Districts"("name");

-- AddForeignKey
ALTER TABLE "VoteHistories" ADD CONSTRAINT "VoteHistories_vote_batch_id_fkey" FOREIGN KEY ("vote_batch_id") REFERENCES "VoteBatches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VoteHistories" ADD CONSTRAINT "VoteHistories_party_id_fkey" FOREIGN KEY ("party_id") REFERENCES "Parties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VoteHistories" ADD CONSTRAINT "VoteHistories_district_id_fkey" FOREIGN KEY ("district_id") REFERENCES "Districts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Votes" ADD CONSTRAINT "Votes_party_id_fkey" FOREIGN KEY ("party_id") REFERENCES "Parties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Votes" ADD CONSTRAINT "Votes_district_id_fkey" FOREIGN KEY ("district_id") REFERENCES "Districts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
