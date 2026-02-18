import type { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../../utils/database";

export const findDistrictHistoricalVotes = async (req: FastifyRequest, res: FastifyReply) => {
  const { districtId } = req.params as { districtId: string };

  const voteHistories = await prisma.voteHistories.findMany({
		where: { district_id: districtId },
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