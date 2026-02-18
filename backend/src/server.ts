import fastify from "fastify";
import cors from "@fastify/cors";
import { uploadElectionController } from "./features/upload-election/index.js";
import { globalErrorHandling } from "./utils/global-error-handling.js";
import { parseElectionFile } from "./features/upload-election/parse-election.js";
import { findVotes } from "./features/find-votes/index.js";
import { aggregatedResults } from "./features/aggregated-results/index.js";
import { findDistricts } from "./features/districts/find-districts.js";
import { findDistrict } from "./features/districts/find-district.js";
import { findDistrictHistoricalVotes } from "./features/districts/find-district-historical-votes.js";
import { findHistoricalVotes } from "./features/find-historical-votes.js";
import { serverSentEvents } from "./features/server-sent-events/index.js";
import { findParties } from "./features/parties/find-parties/index.js";
import { findParty } from "./features/parties/find-party.js";
import { findPartyHistoricalVotes } from "./features/parties/find-party-historical-votes/index.js";

(async () => {
	const server = fastify({
		disableRequestLogging: true,
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

	server.get("/ping", async () => {
		return "pong\n";
	});

	server.post("/upload-elections/:uploadId", uploadElectionController);
	server.get("/read-election", () => parseElectionFile("./temp/election.txt"));
	server.get("/votes", findVotes);
	server.get("/results", aggregatedResults);

	server.get("/districts", findDistricts);
	server.get("/districts/:districtId", findDistrict);
	server.get("/districts/:districtId/history", findDistrictHistoricalVotes);

	server.get("/parties", findParties);
	server.get("/parties/:partyId", findParty);
	server.get("/parties/:partyId/history", findPartyHistoricalVotes);

	server.get("/history", findHistoricalVotes);

	server.get("/stream", { sse: true }, serverSentEvents);

	server.setErrorHandler(globalErrorHandling);

	server.listen({ port: 8080, host: "0.0.0.0" }, (err, address) => {
		if (err) {
			console.error(err);
			process.exit(1);
		}
		console.log(`Server listening at ${address}`);
	});
})();