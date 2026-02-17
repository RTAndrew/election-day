import type { FastifyRequest, FastifyReply } from "fastify";
import { FindPartiesMemberOfParliamentUC } from "./find-mp-per-party.uc";

/**
 * For each district, the party with the highest total_vote_count wins (1 MP).
 * This query returns the count of won districts (MPs) per party.
 */
export const findMpPerParty = async (
	_request: FastifyRequest,
	reply: FastifyReply,
) => {
	const results = await FindPartiesMemberOfParliamentUC.execute();

	return reply.send({
		status: 200,
		data: results,
	});
};
