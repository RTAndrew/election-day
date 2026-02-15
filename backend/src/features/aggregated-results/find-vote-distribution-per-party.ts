import { prisma } from "../../utils/database";
import type { FastifyRequest, FastifyReply } from "fastify";

interface IVoteDistributionPerParty {
	party_id: string;
	party_name: string;
	total_vote_count: bigint;
	vote_percentage: number;
}

export const findVoteDistributionPerParty = async (
	_request: FastifyRequest,
	reply: FastifyReply,
) => {
	const results = await prisma.$queryRaw<IVoteDistributionPerParty[]>`
		SELECT
			parties.id AS party_id,
			parties.name AS party_name,
			COALESCE(SUM(votes."total_vote_count"), 0)::bigint AS total_vote_count,
			ROUND(100.0 * COALESCE(
        SUM(votes."total_vote_count"), 0) / NULLIF(SUM(SUM(votes."total_vote_count")) OVER (), 0)
				, 2
			)::numeric AS vote_percentage
		FROM "Parties" parties
		LEFT JOIN "Votes" votes ON votes.party_id = parties.id
		GROUP BY parties.id, parties.name
		ORDER BY total_vote_count DESC
	`;

	return reply.send({
		status: 200,
		data: results.map((row) => ({
			party_id: row.party_id,
			party_name: row.party_name,
			total_vote_count: Number(row.total_vote_count),
			vote_percentage: Number(row.vote_percentage),
		})),
	});
};
