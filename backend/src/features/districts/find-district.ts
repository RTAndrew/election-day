import type { FastifyReply, FastifyRequest } from "fastify";
import { aggregatedDistricts } from "./aggregated-districts";
import { prisma } from "../../utils/database";

export const findDistrict = async (request: FastifyRequest, response: FastifyReply) => {
  const { district_id } = request.params as { district_id: string };

  const votes = await prisma.votes.findMany({
    where: {
      district_id: district_id,
    },
    include: {
      party: true,
    },
    orderBy: {
      total_vote_count: "desc",
    },
  });

  const votesPerParty = await prisma.votes.findMany({
    where: {
      district_id: district_id,
    },
    include: {
      party: true
    }
  })

  const aggregate = await aggregatedDistricts(district_id);
  const districtTotal = aggregate.district_total_vote_count;

  const winning_party =
    votes[0] && districtTotal > 0
      ? {
          party_id: votes[0].party_id,
          party_name: votes[0].party.name,
          total_votes: votes[0].total_vote_count,
          vote_percentage_share: Number(
            (100 * votes[0].total_vote_count / districtTotal).toFixed(2),
          ),
        }
      : null;

  response.send({
    status: 200,
    data: {
      winning_party,
      total_votes: {
        total_votes: aggregate.district_total_vote_count,
        national_vote_share: aggregate.national_vote_share,
      },
      votes_per_party: votesPerParty,
    },
  });
};