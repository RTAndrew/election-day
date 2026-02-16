import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadLisbonConstituencies } from "../src/utils/load-lisbon-constituencies.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * 24 varied vote profiles so different parties win different districts.
 * Based on plausible Lisbon political diversity: PS (historic centre), PSD (affluent),
 * CH (populist), IL (young urban), PAN (green), L (progressive).
 */
const DISTRICT_PROFILES: Record<string, number>[] = [
	{ PSD: 2200, PS: 4500, IL: 900, L: 700, CH: 600, PAN: 600 },   // Estrela – PS
	{ PSD: 2500, PS: 4200, IL: 1200, L: 800, CH: 500, PAN: 400 },  // Misericórdia – PS
	{ PSD: 5000, PS: 3000, IL: 800, L: 400, CH: 1000, PAN: 500 },  // Santa Maria Maior – PSD
	{ PSD: 5500, PS: 2500, IL: 1600, L: 300, CH: 800, PAN: 600 },  // Belém – PSD
	{ PSD: 3000, PS: 4500, IL: 1100, L: 600, CH: 600, PAN: 800 },  // São Vicente – PS
	{ PSD: 2800, PS: 4200, IL: 1200, L: 700, CH: 400, PAN: 1200 }, // Campo de Ourique – PS
	{ PSD: 4800, PS: 3200, IL: 1500, L: 600, CH: 500, PAN: 400 },  // Ajuda – PSD
	{ PSD: 1800, PS: 2400, IL: 3200, L: 1100, CH: 300, PAN: 500 }, // Alcântara – IL
	{ PSD: 5200, PS: 2800, IL: 1700, L: 400, CH: 700, PAN: 500 },  // Santo António – PSD
	{ PSD: 1600, PS: 2500, IL: 3400, L: 1200, CH: 400, PAN: 600 }, // Arroios – IL
	{ PSD: 2500, PS: 4800, IL: 900, L: 800, CH: 700, PAN: 400 },   // Penha de França – PS
	{ PSD: 2200, PS: 4400, IL: 600, L: 1000, CH: 600, PAN: 700 },  // Beato – PS
	{ PSD: 4600, PS: 3400, IL: 1100, L: 500, CH: 1000, PAN: 400 }, // Campolide – PSD
	{ PSD: 6000, PS: 2600, IL: 1800, L: 300, CH: 900, PAN: 400 },  // Avenidas Novas – PSD
	{ PSD: 2500, PS: 2500, IL: 2600, L: 700, CH: 500, PAN: 1000 }, // Areeiro – IL
	{ PSD: 2800, PS: 2800, IL: 700, L: 400, CH: 3800, PAN: 500 },  // São Domingos de Benfica – CH
	{ PSD: 3500, PS: 4600, IL: 900, L: 600, CH: 1000, PAN: 600 },  // Benfica – PS
	{ PSD: 2200, PS: 4200, IL: 500, L: 1300, CH: 700, PAN: 800 },  // Marvila – PS
	{ PSD: 4200, PS: 3500, IL: 1400, L: 600, CH: 600, PAN: 800 },  // Alvalade – PSD
	{ PSD: 2800, PS: 4600, IL: 1100, L: 700, CH: 900, PAN: 700 },  // Carnide – PS
	{ PSD: 5000, PS: 3200, IL: 1200, L: 500, CH: 800, PAN: 900 },  // Lumiar – PSD
	{ PSD: 2200, PS: 2600, IL: 600, L: 700, CH: 500, PAN: 3600 },  // Olivais – PAN
	{ PSD: 2600, PS: 4200, IL: 1100, L: 800, CH: 1000, PAN: 600 }, // Santa Clara – PS
	{ PSD: 2200, PS: 2600, IL: 3400, L: 900, CH: 400, PAN: 800 },  // Parque das Nações – IL
];

const HOURS_PER_DAY = 24;
const DAYS = 3;
const TOTAL_HOURS = DAYS * HOURS_PER_DAY;

/** Base hourly weight (0–23): peaks 9–12 and 16–18, dip 12–14, low at night. Sum = 1 per day. */
const BASE_HOURLY_WEIGHT = [
	0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.02, 0.03, 0.04, 0.06, 0.07, 0.07,
	0.04, 0.03, 0.04, 0.05, 0.07, 0.08, 0.07, 0.05, 0.04, 0.03, 0.02, 0.01,
];

/** Day intensity: day 1 quieter, day 3 busiest (momentum). */
const DAY_MULTIPLIER = [0.85, 1.0, 1.15];

/** Per-party hourly multiplier (0–23). Different peaks create crossovers. */
const PARTY_HOURLY_SHIFT: Record<string, number[]> = {
	PSD: [0.7, 0.7, 0.7, 0.7, 0.7, 0.8, 1.1, 1.4, 1.5, 1.4, 1.2, 1.0, 0.8, 0.8, 0.9, 1.0, 1.0, 0.9, 0.8, 0.8, 0.7, 0.7, 0.7, 0.7],
	PS: [0.9, 0.9, 0.9, 0.9, 0.9, 1.0, 1.0, 1.1, 1.2, 1.1, 1.0, 0.9, 0.85, 0.85, 0.95, 1.0, 1.1, 1.1, 1.0, 0.95, 0.9, 0.9, 0.9, 0.9],
	IL: [0.6, 0.6, 0.6, 0.6, 0.6, 0.7, 0.8, 0.9, 0.8, 0.7, 0.7, 0.7, 0.8, 0.9, 1.0, 1.2, 1.4, 1.5, 1.4, 1.2, 1.0, 0.8, 0.7, 0.6],
	L: [0.8, 0.8, 0.8, 0.8, 0.8, 0.9, 0.95, 1.0, 1.0, 0.95, 0.9, 0.9, 0.95, 1.0, 1.05, 1.1, 1.15, 1.1, 1.05, 1.0, 0.95, 0.9, 0.85, 0.8],
	CH: [0.9, 0.9, 0.9, 0.9, 0.9, 1.0, 1.05, 1.1, 1.15, 1.1, 1.0, 0.95, 0.9, 0.9, 0.95, 1.0, 1.05, 1.05, 1.0, 0.95, 0.9, 0.9, 0.9, 0.9],
	PAN: [0.85, 0.85, 0.85, 0.85, 0.85, 0.95, 1.0, 1.05, 1.1, 1.05, 1.0, 0.95, 0.9, 0.9, 1.0, 1.1, 1.15, 1.1, 1.05, 1.0, 0.95, 0.9, 0.9, 0.85],
};

function getCumulativeShares(): Record<string, number[]> {
	const partyCodes = Object.keys(PARTY_HOURLY_SHIFT);
	const cumulative: Record<string, number[]> = {};
	for (const code of partyCodes) {
		const shift = PARTY_HOURLY_SHIFT[code];
		const raw: number[] = [];
		for (let h = 0; h < TOTAL_HOURS; h++) {
			const day = Math.floor(h / HOURS_PER_DAY);
			const hourOfDay = h % HOURS_PER_DAY;
			const w = BASE_HOURLY_WEIGHT[hourOfDay]! * DAY_MULTIPLIER[day]! * (shift[hourOfDay] ?? 1);
			raw.push(w);
		}
		const sum = raw.reduce((a, b) => a + b, 0);
		let acc = 0;
		cumulative[code] = raw.map((w) => {
			acc += w;
			return acc / sum;
		});
	}
	return cumulative;
}

/** Add tiny variation (±1%) so lines are not perfectly parallel */
function vary(value: number): number {
	const factor = 0.99 + Math.random() * 0.02;
	return Math.round(value * factor);
}

function formatRow(date: string, district: string, votes: Record<string, number>): string {
	const parts = [date, district];
	for (const [code, count] of Object.entries(votes)) {
		parts.push(String(count), code);
	}
	return parts.join(",");
}

async function main() {
	const constituencies = loadLisbonConstituencies();
	if (constituencies.length === 0) {
		throw new Error("No constituencies loaded from GeoJSON");
	}

	// Use last 3 days from now so seed aligns with "current day" and no gap before new votes
	const baseDate = new Date();
	baseDate.setUTCDate(baseDate.getUTCDate() - 3);
	baseDate.setUTCHours(8, 0, 0, 0);
	const lines: string[] = [];
	const cumulativeByParty = getCumulativeShares();

	for (let c = 0; c < constituencies.length; c++) {
		const district = constituencies[c];
		const totals = DISTRICT_PROFILES[Math.min(c, DISTRICT_PROFILES.length - 1)] ?? DISTRICT_PROFILES[0];

		let prevVotes: Record<string, number> = {};
		for (let h = 0; h < TOTAL_HOURS; h++) {
			const date = new Date(baseDate);
			date.setUTCHours(date.getUTCHours() + h);
			const dateStr = date.toISOString().slice(0, 19);

			const votes: Record<string, number> = {};
			for (const [code, total] of Object.entries(totals)) {
				const share = cumulativeByParty[code]?.[h] ?? (h + 1) / TOTAL_HOURS;
				const v = Math.max(0, vary(Math.round(total * share)));
				votes[code] = Math.max(v, prevVotes[code] ?? 0);
			}
			prevVotes = votes;

			lines.push(formatRow(dateStr, district, votes));
		}
	}

	const tempDir = path.join(__dirname, "../temp");
	if (!fs.existsSync(tempDir)) {
		fs.mkdirSync(tempDir, { recursive: true });
	}
	const seedPath = path.join(tempDir, "seed-lisbon-3day-hourly.txt");
	fs.writeFileSync(seedPath, lines.join("\n") + "\n", "utf-8");

	console.log(`Seed file written to ${seedPath}`);

	const formData = new FormData();
	const file = new Blob([fs.readFileSync(seedPath, "utf-8")], {
		type: "text/plain; charset=utf-8",
	});
	formData.append("file", file, "seed-lisbon-3day-hourly.txt");

	const res = await fetch("http://localhost:8080/upload-elections", {
		method: "POST",
		body: formData,
	});

	if (!res.ok) {
		const text = await res.text();
		throw new Error(`Upload failed: ${res.status} ${res.statusText}\n${text}`);
	}

	const json = (await res.json()) as { status: number; data?: { message?: string } };
	console.log("Upload successful:", json.data?.message ?? json);
	console.log(`Seeded ${constituencies.length} constituencies × ${TOTAL_HOURS} hours (${DAYS} days) = ${lines.length} rows`);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
