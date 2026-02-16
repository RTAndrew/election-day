import type { FastifyReply, FastifyRequest } from "fastify";
import { aggregatedDistricts } from "./aggregated-districts";
import { prisma } from "../../utils/database";

export const findDistrict = async (
	request: FastifyRequest,
	response: FastifyReply,
) => {
	const { district_id } = request.params as { district_id: string };

	const votes = await prisma.votes.findMany({
		include: {
			party: true,
			district: true,
		},
		orderBy: {
			total_vote_count: "desc",
		},
	});

	const districts = await prisma.districts.findMany({
		orderBy: {
			total_vote_count: "desc",
		},
	});

	const districtNationalRank =
		1 + districts.findIndex((vote) => vote.id === district_id);

	const totalNationalVotes = districts.reduce(
		(acc, district) => acc + district.total_vote_count,
		0,
	);

	const districtVotes = votes.filter(
		(vote) => vote.district_id === district_id,
	);

	const aggregate = await aggregatedDistricts(district_id);
	const districtTotalVotes = aggregate.district_total_vote_count;

	const winning_party =
		districtVotes[0] && districtTotalVotes > 0
			? {
					party_id: districtVotes[0].party_id,
					party_name: districtVotes[0].party.name,
					total_votes: districtVotes[0].total_vote_count,
					vote_percentage_share: Number(
						(
							(100 * districtVotes[0].total_vote_count) /
							districtTotalVotes
						).toFixed(2),
					),
				}
			: null;

	response.send({
		status: 200,
		data: {
			...districtVotes.at(0)?.district,
			district_national_rank: districtNationalRank,
			winning_party,
			total_votes: {
				total_national_votes: totalNationalVotes,
				total_votes: aggregate.district_total_vote_count,
				national_vote_share: aggregate.national_vote_share,
			},
			votes_per_party: districtVotes,
		},
	});
};
