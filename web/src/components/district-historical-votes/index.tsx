import SummaryCardReport from "@/components/summary-card-report";
import { Line } from "@ant-design/charts";
import { useMemo } from "react";
import { prepareDistrictHistoricalVotesData, type DistrictHistoricalVotesProps, type IHistoricalVoteChartPoint } from "./utils";


const DistrictHistoricalVotes = ({
	data,
	isPending,
	error,
	prepareChartData = prepareDistrictHistoricalVotesData,
	title = "Historical Votes",
}: DistrictHistoricalVotesProps) => {
	const chartData = useMemo(
		() => prepareChartData(data?.data ?? []),
		[data, prepareChartData],
	);

	if (isPending) return <div>Loading...</div>;
	if (!data || error) return <div>No data</div>;

	const config = {
		interaction: {
			brushFilter: true,
		},
		colorField: "name",
		yField: "vote",
		xField: (d: IHistoricalVoteChartPoint) => new Date(d.date),
		axis: {
			x: {
				labelAutoRotate: false,
			},
		},
		data: chartData,
	};

	return (
		<SummaryCardReport title={title}>
			<Line {...config} />
		</SummaryCardReport>
	);
};

export default DistrictHistoricalVotes;
