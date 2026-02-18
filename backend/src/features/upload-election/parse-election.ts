import fs from "node:fs";
import { PartyCode } from "../../../prisma/generated/enums.js";

export type PartyVotes = {
	vote_count: number;
	party_code: `${PartyCode}`;
};

export type ElectionRow = {
	district: string;
	votes: PartyVotes[];
	recorded_at?: string;
};

// Optional date/datetime prefix: YYYY-MM-DD or YYYY-MM-DDTHH:mm[:ss]
const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}(:\d{2})?)?$/;

/**
 * Parses a single line from the election file.
 * Format: district_name, vote_count, party_code, vote_count, party_code, ...
 * Optional date prefix: YYYY-MM-DD, district_name, vote_count, party_code, ...
 * District name may contain escaped commas: \,
 */
export function parseElectionLine(
	line: string,
	lineNumber: number,
): ElectionRow {
	let i = 0;
	const parts = line.split(",");
	let possibleCreationDate = parts[i] ?? "";

	// Optional date prefix: YYYY-MM-DD
	// check if the possibleCreationDate is actually a valid date, which
	// is used to store the recorded_at date during SEED
	let recorded_at: string | undefined;
	if (ISO_DATE_REGEX.test(possibleCreationDate.trim())) {
		recorded_at = possibleCreationDate.trim();
		i++; // skip the date
	}

	let districtName = parts[i] ?? "";
	// First column may contain "\", meaning a literal escaped comma in the district name
	while (districtName.endsWith("\\") && i + 1 < parts.length) {
		districtName = districtName.slice(0, -1) + "," + (parts[++i] ?? "").trim();

		if (typeof districtName === "number") {
			throw new Error(
				`Invalid district name: ${districtName} on line ${lineNumber}`,
			);
		}
	}

	i++; // skip the district name
	const restOfLineBesidesTheDistrictName = parts.slice(i);

	const votes: PartyVotes[] = [];
	for (let j = 0; j < restOfLineBesidesTheDistrictName.length - 1; j += 2) {
		const voteCount = parseInt(
			restOfLineBesidesTheDistrictName[j]?.trim() ?? "0",
			10,
		);

		const partyCode = (restOfLineBesidesTheDistrictName[j + 1] ?? "").trim();
		if (partyCode) {
			if (!Object.keys(PartyCode).includes(partyCode.toUpperCase()))
				throw new Error(
					`Invalid party code: ${partyCode} on line ${lineNumber}`,
				);

			votes.push({
				vote_count: voteCount,
				party_code: partyCode as PartyCode,
			});
		}
	}

	return { district: districtName, votes, ...(recorded_at && { recorded_at }) };
}

/**
 * Parses election content (one district per line).
 */
export function parseElectionContent(content: string): ElectionRow[] {
	return content
		.split("\n")
		.map((line) => line.trim())
		.filter(Boolean)
		.map((line, index) => parseElectionLine(line, index + 1));
}

/**
 * Parses the election file at the given path (one district per line).
 */
export function parseElectionFile(filepath: string): ElectionRow[] {
	const content = fs.readFileSync(filepath, "utf-8");
	return parseElectionContent(content);
}
