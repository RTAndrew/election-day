import SummaryCardReport from "@/components/summary-card-report";
import {
	useFindDistrict,
	useFindDistrictHistoricalVotes,
} from "@/services/district";
import { Line } from "@ant-design/charts";
import { useMemo } from "react";

interface DistrictHistoricalVotesProps {
	districtId: string;
}

const DistrictHistoricalVotes = ({
	districtId,
}: DistrictHistoricalVotesProps) => {
	const { data, isPending, error } = useFindDistrictHistoricalVotes(districtId);

	if (isPending) return <div>Loading...</div>;
	if (!data || error) return <div>No data</div>;

	const chartData = data?.data?.map((item) => ({
		name: item.party.name,
		vote: item.vote_count,
		date: item.createdAt,
	}));

	const config = {
		interaction: {
			brushFilter: true,
		},
		colorField: "name",
		yField: "vote",
		xField: (d) => new Date(d.date),
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

export default DistrictHistoricalVotes;
