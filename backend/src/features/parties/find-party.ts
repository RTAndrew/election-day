import type { FastifyReply, FastifyRequest } from "fastify";
import { FindPartiesUC } from "./find-parties/find-parties.uc";
import { prisma } from "../../utils/database";

export const findParty = async (
	request: FastifyRequest,
	reply: FastifyReply,
) => {
	const { partyId } = request.params as { partyId: string };


  const performance = await prisma.votes.findMany({
    where: {
      party_id: partyId,
    },
    include: {
      district: true,
    },
    orderBy: {
      total_vote_count: "desc",
    },
  });

  const strongestDistrict = performance?.[0]?.district ?? null;
  const weakestDistrict = performance?.[performance.length - 1]?.district ?? null;


	const results = await FindPartiesUC.execute(partyId);

	return reply.send({
		status: 200,
		data: {
			...results[0],
			strongest_district: strongestDistrict,
			weakest_district: weakestDistrict,
		},
	});
};
