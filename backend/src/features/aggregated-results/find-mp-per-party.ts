import { prisma } from "../../utils/database";
import type { FastifyRequest, FastifyReply } from "fastify";

interface IMpPerParty {
	party_id: string;
	party_name: string;
	mp_count: number;
}

/**
 * For each district, the party with the highest total_vote_count wins (1 MP).
 * This query returns the count of won districts (MPs) per party.
 */
export const findMpPerParty = async (
	_request: FastifyRequest,
	reply: FastifyReply,
) => {
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
		GROUP BY parties.id, parties.name
		ORDER BY mp_count DESC
	`;

	return reply.send({
		status: 200,
		data: results,
	});
};
