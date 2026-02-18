import SummaryCardReport from "@/components/summary-card-report";
import { useDistrict } from "@/services/district";
import { formatKNumber } from "@/utils/format-k-number";
import { Pie, type PieConfig } from "@ant-design/charts";

interface DistrictsVotesPerPartyProps {
	districtId: string;
}


const DistrictVotesPerParty = ({ districtId }: DistrictsVotesPerPartyProps) => {
	const { data, isPending, error } = useDistrict(districtId);

	if (isPending) return <div>Loading...</div>;
	if (!data || error) return <div>No data</div>;

	const config: PieConfig = {
		innerRadius: 0.5,
		angleField: "value",
		colorField: "name",
		label: {
			text: "value",
			formatter: (value: number) => {
				return `${Number((value / (data?.data?.total_votes?.total_votes ?? 0)) * 100).toFixed(2)}%`;
			},
			style: {
				fontSize: 10,
				fontWeight: "bold",
			},
		},
		data: data?.data?.votes_per_party.map((vote: any) => ({
			name: vote.party.name,
			value: vote.total_vote_count,
		})),
		tooltip: (tdata) => {
			return {
				name: tdata.name,
				value: formatKNumber(Number(tdata.value)),
			};
		},
	};

	return (
		<SummaryCardReport title="Party Votes">
			<Pie {...config} />
		</SummaryCardReport>
	);
};

export default DistrictVotesPerParty;
