import type { FastifyError, FastifyReply, FastifyRequest } from "fastify";


export const globalErrorHandling = async (
	error: FastifyError,
	_req: FastifyRequest,
	res: FastifyReply,
) => {
	res.status(500).send({
		status: 500,
		error: error.message,
	});
};