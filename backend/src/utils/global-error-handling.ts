import type { FastifyError, FastifyReply, FastifyRequest } from "fastify";


export const globalErrorHandling = async (
  error: FastifyError,
  req: FastifyRequest,
  res: FastifyReply
) => {

  return {
    status: 500,
    errors: [error.message],
    data: null,
  };
};