import type { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../../utils/database";

export const findVotes = async (
	_request: FastifyRequest,
	response: FastifyReply,
) => {
	const foundVotes = await prisma.districts.findMany({
		include: {
			votes: {
				include: {
					party: true,
				},
			},
		},
	});

	const formattedVotes = foundVotes.map((district) => {
		let winningPartyCount = 0;
		let winningParty = null;

		const votes = district.votes.map((vote) => {
			// Find the winning party
			if (vote.total_vote_count > winningPartyCount) {
				winningParty = vote.party;
				winningPartyCount = vote.total_vote_count;
			}

			return {
				...vote.party,
				total_vote_count: vote.total_vote_count,
				last_vote_history_id: vote.last_vote_history_id,
				vote_percentage: (
					(vote.total_vote_count / district.total_vote_count) *
					100
				).toFixed(1),
			};
		});

		return {
			votes,
			district: district.name,
			winning_party: winningParty,
		};
	});

	response.send({
		status: 200,
		data: formattedVotes,
	});
};