import type { FastifyReply, FastifyRequest } from "fastify";
import { randomUUID } from "node:crypto";
import { EventEmitter } from "node:events";

export type TSseEvent = {
	id: string;
	event: string;
	data: unknown;
};

const sseEventEmitter = new EventEmitter();

export const emitSseEvent = (data: unknown) => {
	sseEventEmitter.emit("message", data);
};

export const serverSentEvents = async (
	_request: FastifyRequest,
	reply: FastifyReply,
) => {
	// When client doesn't send Accept: text/event-stream,
	// @fastify/sse skips SSE and reply.sse is undefined.
	if (!reply.sse) {
		return reply.send({
			message: "Connect with Accept: 'text/event-stream' for SSE",
		});
	}

	await reply.sse.send({ data: "Hello SSE!" });
	reply.sse.keepAlive();

	sseEventEmitter.on("message", async (data: TSseEvent) => {
		if (reply.sse?.isConnected) {
			await reply.sse.send({
				id: randomUUID(),
				event: "message",
				data,
			});
		}
	});
};
