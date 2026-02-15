import SummaryCardReport from "@/components/summary-card-report";
import { useFindHistoricalVotes } from "@/services/use-historical-votes";
import { Line } from "@ant-design/charts";
import { useMemo } from "react";

const OverviewHistoricalVotes = () => {
	const { data, isPending, error } = useFindHistoricalVotes();

	const chartData = useMemo(() => {
		const items =
			data?.data?.map((item) => ({
				name: item.party.name,
				vote: item.vote_count,
				date: item.createdAt,
			})) ?? [];
		// One point per (party, date): aggregate by summing votes (data is per-district, same date = same snapshot)
		const byKey = new Map<string, { name: string; vote: number; date: string }>();
		for (const item of items) {
			const key = `${item.name}\t${item.date}`;
			const existing = byKey.get(key);
			if (existing) {
				existing.vote += item.vote;
			} else {
				byKey.set(key, { ...item });
			}
		}
		const aggregated = [...byKey.values()];
		aggregated.sort((a, b) => {
			if (a.name !== b.name) return a.name.localeCompare(b.name);
			return new Date(a.date).getTime() - new Date(b.date).getTime();
		});
		return aggregated;
	}, [data]);

	if (isPending) return <div>Loading...</div>;
	if (!data || error) return <div>No data</div>;


	const config = {
		interaction: {
			brushFilter: true,
		},
		colorField: "name",
		yField: "vote",
		xField: (d: { date: string }) => new Date(d.date),
		axis: {
			x: {
				labelAutoRotate: false,
			},
		},
		data: chartData,
  };

	return (
		<SummaryCardReport title="Historical Votes">
			<Line {...config} />
		</SummaryCardReport>
	);
};

export default OverviewHistoricalVotes;
