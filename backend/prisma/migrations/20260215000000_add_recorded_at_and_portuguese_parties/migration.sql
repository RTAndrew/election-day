-- AlterTable
ALTER TABLE "VoteBatches" ADD COLUMN "recorded_at" TIMESTAMP(3);

-- CreateEnum (new Portuguese party codes)
CREATE TYPE "PartyCode_new" AS ENUM ('PSD', 'PS', 'IL', 'CH', 'PAN', 'L', 'BE');

-- AlterTable: Map old UK codes to new Portuguese codes
ALTER TABLE "Parties" ALTER COLUMN "code" DROP DEFAULT;
ALTER TABLE "Parties" ALTER COLUMN "code" TYPE "PartyCode_new" USING (
  CASE "code"::text
    WHEN 'C' THEN 'PSD'::"PartyCode_new"
    WHEN 'L' THEN 'PS'::"PartyCode_new"
    WHEN 'UKIP' THEN 'CH'::"PartyCode_new"
    WHEN 'LD' THEN 'IL'::"PartyCode_new"
    WHEN 'G' THEN 'PAN'::"PartyCode_new"
    WHEN 'IND' THEN 'L'::"PartyCode_new"
    WHEN 'SNP' THEN 'BE'::"PartyCode_new"
    ELSE 'PSD'::"PartyCode_new"
  END
);

-- Drop old enum and rename new
DROP TYPE "PartyCode";
ALTER TYPE "PartyCode_new" RENAME TO "PartyCode";
