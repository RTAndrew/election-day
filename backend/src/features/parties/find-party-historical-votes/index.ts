import type { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../../../utils/database";

export const findPartyHistoricalVotes = async (request: FastifyRequest, reply: FastifyReply) => {
	const { partyId } = request.params as { partyId: string };

	const votes = await prisma.voteHistories.findMany({
		where: {
			party_id: partyId,
    },
    include: {
      district: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  reply.send({
    status: 200,
    data: votes,
  });
};