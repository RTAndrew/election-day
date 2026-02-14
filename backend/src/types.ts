import type { FastifyReply, FastifyRequest } from "fastify";

export interface IServerResponse<T = any> {
  status: number;
  errors?: any[];
  data: null | T | Array<T>;
}



export type TServerController<
> = (
	req: FastifyRequest,
	res: FastifyReply,
) => Promise<IServerResponse> | IServerResponse;
