import type { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../../utils/database";

export const findDistrictHistoricalVotes = async (req: FastifyRequest, res: FastifyReply) => {
  const { district_id } = req.params as { district_id: string };

  const voteHistories = await prisma.voteHistories.findMany({
    where: { district_id },
    include: {
      party: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  res.status(200).send({
    status: 200,
    data: voteHistories,
  });
};