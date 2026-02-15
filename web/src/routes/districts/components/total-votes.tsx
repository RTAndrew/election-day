import SummaryCardReport from "@/components/summary-card-report";
import { useFindDistrict } from "@/services/district";

interface DistrictTotalVotesProps {
	districtId: string;
}

const DistrictTotalVotes = ({ districtId }: DistrictTotalVotesProps) => {
	const { data, isPending, error } = useFindDistrict(districtId);

	if (isPending) return <div>Loading...</div>;
  if (error || !data) return <div>Error: {error?.message}</div>;
  if (!data.data) return <div>No data</div>;

	return (
		<div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
			<SummaryCardReport title="Winning Party">
				{data.data.winning_party?.party_name}
				{data.data.winning_party?.total_votes}
				{data.data.winning_party?.vote_percentage_share}
			</SummaryCardReport>

			<SummaryCardReport title="Total Votes">
				{data.data.total_votes.total_votes}
				{data.data.total_votes.national_vote_share}
			</SummaryCardReport>
		</div>
	);
};

export default DistrictTotalVotes;
