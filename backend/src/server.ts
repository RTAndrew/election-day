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

const server = fastify();

// hooks
server.register(cors, { origin: true }); // allow all origins in development
server.register(import("@fastify/multipart"));

server.get("/ping", async (request, reply) => {
	return "pong\n";
});


server.post("/upload-elections", uploadElectionController)
server.get("/read-election", () => parseElectionFile('./temp/election.txt'))
server.get("/votes", findVotes);
server.get("/results", aggregatedResults);
server.get("/distributed-votes-per-party", findVoteDistributionPerParty);
server.get("/mp-per-party", findMpPerParty);

server.get("/districts", findDistricts);
server.get("/districts/:district_id", findDistrict);

server.setErrorHandler(globalErrorHandling);

server.listen({ port: 8080 }, (err, address) => {
	if (err) {
		console.error(err);
		process.exit(1);
	}
	console.log(`Server listening at ${address}`);
});
