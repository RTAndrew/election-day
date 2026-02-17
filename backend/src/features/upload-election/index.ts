import path from "node:path";
import type { FastifyRequest, FastifyReply } from "fastify";
import { pipeline } from "node:stream/promises";
import fs from "node:fs";
import { parseElectionFile } from "./parse-election.js";
import { prisma } from "../../utils/database.js";
import { saveDistrictElection } from "../save-district-election/index.js";
import { generateUUID } from "../../utils/uuid.js";
import { VoteBatchStatus } from "../../../prisma/generated/enums.js";
import { emitSseEvent } from "../server-sent-events/index.js";

const __dirname = path.dirname(new URL("../../", import.meta.url).pathname);

export const uploadsDir = path.join(__dirname, "temp");

export const uploadElectionController = async (req: FastifyRequest, res: FastifyReply) => {
  const data = await req.file();
  if (!data) {
    throw new Error("No file uploaded");
  }

  const filename = `${Date.now()}_${data.filename}`;
  const filepath = path.join(uploadsDir, filename);
  await pipeline(data.file, fs.createWriteStream(filepath, { flags: "w" }));

  const rows = parseElectionFile(filepath);


  // One batch per upload so all districts share the same snapshot time (fixes historical chart)
  const batchCreatedAt = new Date();
  const txTimeoutMs = 120_000; // seed can have 1700+ rows; default 5s is too low
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

      for (const row of rows) {
        await saveDistrictElection(row, voteBatch.id, tx, {
          batchCreatedAt,
        });
      }
    },
    { timeout: txTimeoutMs },
  );

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