import { Prisma } from "../../../../prisma/generated/client";
import { prisma } from "../../../utils/database";
import { FindPartiesMemberOfParliamentUC } from "../../aggregated-results/find-mp-per-party/find-mp-per-party.uc";

export interface IFindPartiesResponse extends Prisma.PartiesModel {
	mp_count: number;
	total_vote_count: number;
	vote_percentage: number;
}

/** Find all parties with their total vote count and vote percentage */
export class FindPartiesUC {
	static async execute(partyId?: string | null) {
		const results = await prisma.$queryRaw<
			Omit<IFindPartiesResponse, "mp_count">[]
		>`
			/** Find the total number of votes */
			WITH TOTAL_VOTES_CTE AS (
				SELECT COALESCE(SUM("total_vote_count"), 0)::bigint AS grand_total
				FROM "Votes"
			)

			SELECT
				parties.*,
				COALESCE(SUM(votes."total_vote_count"), 0)::bigint AS total_vote_count,
				/** Calculate the vote percentage for the party */
				ROUND(
					100.0 * COALESCE(SUM(votes."total_vote_count"), 0)
						/ NULLIF((SELECT grand_total FROM TOTAL_VOTES_CTE), 0),
					2
				)::numeric AS vote_percentage
			FROM "Parties" parties
			LEFT JOIN "Votes" votes ON votes.party_id = parties.id
			WHERE ${partyId ? Prisma.sql`parties.id = ${partyId}` : Prisma.sql`1=1`}
			GROUP BY parties.id, parties.name
			ORDER BY total_vote_count DESC
		`;

		const memberOfParliamentMapped = (
			await FindPartiesMemberOfParliamentUC.execute(partyId)
		).reduce(
			(acc, curr) => {
				acc[curr.party_id] = curr.mp_count;
				return acc;
			},
			{} as Record<string, number>,
		);

		return results.map((row) => ({
			...row,
			total_vote_count: Number(row.total_vote_count),
			vote_percentage: Number(row.vote_percentage),
			mp_count: memberOfParliamentMapped[row.id] ?? 0,
		})) as IFindPartiesResponse[];
	}
}
