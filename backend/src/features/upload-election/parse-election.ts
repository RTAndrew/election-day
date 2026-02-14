import fs from "node:fs";
import { PartyCode } from "../../../prisma/generated/enums";

export type PartyVotes = {
	vote_count: number;
	party_code: `${PartyCode}`;
};

export type ElectionRow = {
	district: string;
	votes: PartyVotes[];
};

/**
 * Parses a single line from the election file.
 * Format: district_name, vote_count, party_code, vote_count, party_code, ...
 * District name may contain escaped commas: \,
 */
export function parseElectionLine(line: string): ElectionRow {
	const parts = line.split(",");
	let i = 0;
	let districtPart = parts[i] ?? "";

	// First column may contain \, meaning a literal comma in the district name
	while (districtPart.endsWith("\\") && i + 1 < parts.length) {
		districtPart = districtPart.slice(0, -1) + "," + (parts[++i] ?? "");
	}
	i++;
	const district = districtPart.trim();
	const rest = parts.slice(i);

	const votes: PartyVotes[] = [];
	for (let j = 0; j < rest.length - 1; j += 2) {
		const voteCount = parseInt(rest[j]?.trim() ?? "0", 10);
		const partyCode = (rest[j + 1] ?? "").trim();
		if (partyCode) {
			if (!Object.keys(PartyCode).includes(partyCode.toUpperCase()))
				throw new Error(`Invalid party code: ${partyCode}`);

			votes.push({
				vote_count: voteCount,
				party_code: partyCode as PartyCode,
			});
		}
	}

	return { district, votes };
}

/**
 * Parses the election file at the given path (one district per line).
 */
export function parseElectionFile(filepath: string): ElectionRow[] {
	const content = fs.readFileSync(filepath, "utf-8");
	return content
		.split("\n")
		.map((line) => line.trim())
		.filter(Boolean)
		.map(parseElectionLine);
}
