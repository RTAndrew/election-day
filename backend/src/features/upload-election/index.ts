import path from "node:path";
import type { FastifyRequest, FastifyReply } from "fastify";
import { pipeline } from "node:stream/promises";
import fs from "node:fs";
import { parseElectionFile } from "./parse-election.js";
import { prisma } from "../../utils/database.js";
import { saveDistrictElection } from "../save-district-election/index.js";
import { generateUUID } from "../../utils/uuid.js";
import { VoteBatchStatus } from "../../../prisma/generated/enums.js";

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

  for (const row of rows) {
    await prisma.$transaction(async (tx) => {
      const voteBatch = await tx.voteBatches.create({
        data: {
          id: generateUUID("vb"),
          total_rows: rows.length,
          status: VoteBatchStatus.COMPLETED,
        },
      });

      await saveDistrictElection(row, voteBatch.id, tx);
      return voteBatch;
    });
  }


  res.send({
    status: 200,
    data: {
      message: "File uploaded successfully",
      election: rows,
    },
  });
};