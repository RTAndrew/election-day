import type { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../utils/database";

export const findHistoricalVotes = async (_request: FastifyRequest, reply: FastifyReply) => {
  const votes = await prisma.voteHistories.findMany({
    include: {
      party: true,
      district: true,
    },
    orderBy: {
      createdAt: 'asc',
    }
  })
  return reply.send({
    status: 200,
    data: votes
  });
};