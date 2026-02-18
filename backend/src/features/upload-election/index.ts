import type { FastifyRequest, FastifyReply } from "fastify";
import { text } from "node:stream/consumers";
import { parseElectionContent } from "./parse-election.js";
import { prisma } from "../../utils/database.js";
import { saveDistrictElection } from "../save-district-election/index.js";
import { generateUUID } from "../../utils/uuid.js";
import { VoteBatchStatus } from "../../../prisma/generated/enums.js";
import { emitSseEvent } from "../server-sent-events/index.js";

const SIX_MINUTES_IN_MS = 60 * 1000 * 6;

const fakePromise = (ms: number) =>
	new Promise((resolve) => {
		// resolve(true); // TESTING: uncomment to run without delay/throttling
		setTimeout(resolve, ms);
	});

export const uploadElectionController = async (
	req: FastifyRequest,
	res: FastifyReply,
) => {
	const processingStartedAt = performance.now();

	const { uploadId } = req.params as { uploadId: string };
	const data = await req.file();
	if (!data) {
		throw new Error("No file uploaded");
	}

	emitSseEvent({
		event: "uploadProgress",
		uploadId,
		phase: "parsing_file",
		data: {
			status: "loading",
		},
	});

	await fakePromise(1000);
	const content = await text(data.file);
	const rows = parseElectionContent(content);

	emitSseEvent({
		event: "uploadProgress",
		uploadId,
		phase: "parsing_file",
		data: {
			status: "completed",
			total_rows: rows.length,
			current_row: rows.length,
		},
	});

	// One batch per upload so all districts share the same snapshot time (fixes historical chart)
	const batchCreatedAt = new Date();
	const txTimeoutMs = SIX_MINUTES_IN_MS; // seed can have 1700+ rows; default 5s is too low
	await prisma.$transaction(
		async (tx) => {
			const voteBatch = await tx.voteBatches.create({
				data: {
					id: generateUUID("vb"),
					total_rows: rows.length,
					status: VoteBatchStatus.COMPLETED,
					createdAt: batchCreatedAt,
					updatedAt: batchCreatedAt,
				},
			});

			for (let i = 0; i < rows.length; i++) {
				// TESTING: uncomment to test delay/throttling on smaller files
				// await fakePromise(1000);

				// TESTING: uncomment to test error
				// if (i === 3) {
				// throw new Error("Hello, beautiful error");
				// }

				const row = rows[i]!;
				await saveDistrictElection(row, voteBatch.id, tx, {
					batchCreatedAt,
				});

				emitSseEvent({
					event: "uploadProgress",
					uploadId,
					phase: "insert_vote",
					data: {
						status: "loading",
						total_rows: rows.length,
						current_row: i + 1,
					},
				});
			}

			emitSseEvent({
				event: "uploadProgress",
				uploadId,
				phase: "insert_vote",
				data: {
					status: "completed",
					total_rows: rows.length,
					current_row: rows.length,
				},
			});

			emitSseEvent({
				event: "uploadProgress",
				uploadId,
				phase: "completed",
				data: { status: "loading" },
			});

			await tx.voteBatches.update({
				where: { id: voteBatch.id },
				data: {
					status: VoteBatchStatus.COMPLETED,
					completed_at_ms: performance.now() - processingStartedAt,
				},
			});
		},
		{ timeout: txTimeoutMs },
	);

	await fakePromise(3000);

	emitSseEvent({
		event: "uploadProgress",
		uploadId,
		phase: "completed",
		data: { status: "completed" },
	});

	emitSseEvent({
		event: "votesUpdated",
		data: {},
	});

	res.send({
		status: 200,
		data: {
			message: "File uploaded successfully",
			election: rows,
		},
	});
};
