import { Prisma } from "../../../prisma/generated/client.js";
import { prisma } from "../../utils/database.js";

interface IMpPerParty {
	party_id: string;
	party_name: string;
	mp_count: number;
}

export class FindPartiesMemberOfParliamentUC {
	static async execute(partyId?: string | null) {
		const results = await prisma.$queryRaw<IMpPerParty[]>`
      WITH district_winners AS (
        SELECT DISTINCT ON (district_id)
          district_id,
          party_id
        FROM "Votes"
        ORDER BY district_id, total_vote_count DESC
      )
      SELECT
        parties.id AS party_id,
        parties.name AS party_name,
        COALESCE(COUNT(won_district.district_id), 0)::int AS mp_count
      FROM "Parties" parties
      LEFT JOIN district_winners won_district ON won_district.party_id = parties.id
      WHERE ${partyId ? Prisma.sql`parties.id = ${partyId}` : Prisma.sql`1=1`}
      GROUP BY parties.id, parties.name
      ORDER BY mp_count DESC
	`;

    return results;
	}
}
