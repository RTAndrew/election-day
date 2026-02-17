export interface IHistoricalVoteItem {
	party: { name: string };
	vote_count: number;
	createdAt: string;
}

export interface IHistoricalVoteChartPoint {
	name: string;
	vote: number;
	date: string;
}

/** Union of item shapes accepted by district (multi-line) and party (single-line) preparers. */
export type HistoricalVoteInputItem = IHistoricalVoteItem | IPartyHistoricalVoteItem;

export interface DistrictHistoricalVotesProps {
	title?: string;
	error: unknown;
	isPending: boolean;
	/** Query result: data is the API response with .data array of historical vote items */
	data?: { data?: HistoricalVoteInputItem[] | null };
	/** Transform raw API items into chart points. Default: aggregate by (party, date) and sort. */
	prepareChartData?: (
		items: HistoricalVoteInputItem[],
	) => IHistoricalVoteChartPoint[];
}

/**
 * AntDesign Line Chart expects data in the following format:
 * [
 *   { name: "Party 1", vote: 100, date: "2024-01-01" },
 *   { name: "Party 2", vote: 200, date: "2024-01-01" },
 *   { name: "Party 1", vote: 150, date: "2024-01-02" },
 *   { name: "Party 2", vote: 250, date: "2024-01-02" },
 * ]
 *
 * To make the graph readable and stable, the data must be aggregated by (party, date)
 * and sorted by party name then date, so each party's line is chronological and the chart is readable.
 */
export const prepareDistrictHistoricalVotesData = (
	items: IHistoricalVoteItem[],
): IHistoricalVoteChartPoint[] => {
	const mappedData = items.map((item) => ({
		name: item.party.name,
		vote: item.vote_count,
		date: item.createdAt,
	}));

	// One point per (party, date): API can return multiple rows per key (e.g. one per district in
	// overview). Sum votes so the chart has a single value per series per date.
	const byKey = new Map<string, IHistoricalVoteChartPoint>();
	for (const item of mappedData) {
		const key = `${item.name}\t${item.date}`;
		const existing = byKey.get(key);
		if (existing) {
			existing.vote += item.vote;
		} else {
			byKey.set(key, { ...item });
		}
	}

	const aggregated = [...byKey.values()];
	// Sort by party then date so each party’s line is chronological and the chart is readable.
	aggregated.sort((a, b) => {
		if (a.name !== b.name) return a.name.localeCompare(b.name);
		return new Date(a.date).getTime() - new Date(b.date).getTime();
	});
	return aggregated;
}

/** Items with at least vote_count and createdAt (e.g. party history API). */
export interface IPartyHistoricalVoteItem {
	vote_count: number;
	createdAt: string;
}

/**
 * Single-line chart: one party’s history. Aggregate by date (multiple districts per date)
 * and sort by date so the line is chronological and has no vertical spikes.
 */
export const preparePartyHistoricalVotesData = (
	items: IPartyHistoricalVoteItem[],
): IHistoricalVoteChartPoint[] => {
	const byDate = new Map<string, number>();
	for (const item of items) {
		const key = item.createdAt;
		byDate.set(key, (byDate.get(key) ?? 0) + item.vote_count);
	}
	return [...byDate.entries()]
		.sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
		.map(([date, vote]) => ({ name: "", vote, date }));
}
