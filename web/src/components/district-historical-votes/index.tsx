import SummaryCardReport from "@/components/summary-card-report";
import { Line } from "@ant-design/charts";
import { useMemo } from "react";
import {
	prepareDistrictHistoricalVotesData,
	type DistrictHistoricalVotesProps,
	type HistoricalVoteInputItem,
	type IHistoricalVoteChartPoint,
} from "./utils";
import Loading from "../loading";
import { Empty } from "antd";

const DistrictHistoricalVotes = ({
	data,
	isPending,
	error,
	prepareChartData = prepareDistrictHistoricalVotesData as (
		items: HistoricalVoteInputItem[],
	) => ReturnType<typeof prepareDistrictHistoricalVotesData>,
	title = "Historical Votes",
}: DistrictHistoricalVotesProps) => {
	const chartData = useMemo(
		() => prepareChartData(data?.data ?? []),
		[data, prepareChartData],
	);

	if (isPending) return <Loading fullWidth />;
	if (error || !data)
		return <Empty description="An error occurred while fetching the data" />;
	if (data?.data?.length === 0) {
		return (
			<SummaryCardReport title="Historical Votes">
				<Empty description="No data found" />
			</SummaryCardReport>
		);
	}

	const config = {
		interaction: {
			brushFilter: true,
		},
		connectNulls: true,
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
