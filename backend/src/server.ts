import fastify from "fastify";
import cors from "@fastify/cors";
import { uploadElectionController } from "./features/upload-election";
import { globalErrorHandling } from "./utils/global-error-handling";
import { parseElectionFile } from "./features/upload-election/parse-election";
import { findVotes } from "./features/find-votes";
import { aggregatedResults } from "./features/aggregated-results";
import { findVoteDistributionPerParty } from "./features/aggregated-results/find-vote-distribution-per-party";
import { findMpPerParty } from "./features/aggregated-results/find-mp-per-party";
import { findDistricts } from "./features/districts/find-districts";
import { findDistrict } from "./features/districts/find-district";
import { findDistrictHistoricalVotes } from "./features/districts/find-district-historical-votes";
import { findHistoricalVotes } from "./features/find-historical-votes";
import { serverSentEvents } from "./features/server-sent-events";

(async () => {
	const server = fastify({
		logger: {
			level: "debug",
			transport: {
				target: "pino-pretty",
				options: {
					translateTime: "HH:MM:ss Z",
					ignore: "pid,hostname",
				},
			},
		},
	});


	await server.register(import("@fastify/sse"), {
		serializer: (value: unknown) =>
			JSON.stringify(
				value,
				(_key, v) => (typeof v === "bigint" ? v.toString() : v), // fix for bigint serialization
			),
	});
	await server.register(cors, { origin: true }); // allow all origins in development
	await server.register(import("@fastify/multipart"));

	server.get("/ping", async (request, reply) => {
		return "pong\n";
	});

	server.post("/upload-elections", uploadElectionController);
	server.get("/read-election", () => parseElectionFile("./temp/election.txt"));
	server.get("/votes", findVotes);
	server.get("/results", aggregatedResults);
	server.get("/distributed-votes-per-party", findVoteDistributionPerParty);
	server.get("/mp-per-party", findMpPerParty);

	server.get("/districts", findDistricts);
	server.get("/districts/:district_id", findDistrict);
	server.get("/districts/:district_id/history", findDistrictHistoricalVotes);
	server.get("/history", findHistoricalVotes);

	server.get("/stream", { sse: true }, serverSentEvents);

	server.setErrorHandler(globalErrorHandling);

	server.listen({ port: 8080 }, (err, address) => {
		if (err) {
			console.error(err);
			process.exit(1);
		}
		console.log(`Server listening at ${address}`);
	});
})();