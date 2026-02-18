import type { FastifyRequest, FastifyReply } from "fastify";
import { FindPartiesUC } from "./find-parties.uc";


export const findParties = async (
	_request: FastifyRequest,
	reply: FastifyReply,
) => {

	const results = await FindPartiesUC.execute();

	return reply.send({
		status: 200,
		data: results.map((row) => ({
			...row,
			total_vote_count: Number(row.total_vote_count),
			vote_percentage: Number(row.vote_percentage),
		})),
	});
};
