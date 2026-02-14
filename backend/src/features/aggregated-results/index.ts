import { prisma } from "../../utils/database";
import type { FastifyReply, FastifyRequest } from "fastify";

const districtResults = async () => {
	const results = await prisma.parties.findMany({
		include: {
      votes: {
        include: {
          district: true,
        }
      },
		},
	});

	return results;
};

const getDistrictWinningParty = async () => {
  const results = await prisma.votes.findMany({
		orderBy: {
			total_vote_count: "desc",
		},
		where: {
			district_id: {
				equals: "district_nohe92yd6p",
			},
    },
    include: {
      party: true,
    },
		take: 1,
	});

  return results;
};


export const aggregatedResults = async (
	request: FastifyRequest,
	response: FastifyReply,
) => {
	const getDistrictResults = await districtResults();
  const p = await getDistrictWinningParty();

	response.send({
		status: 200,
		data: {
      winningParty: p,
      districts: getDistrictResults,
		},
	});
};
