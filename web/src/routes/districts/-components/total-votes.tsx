import SummaryCardReport from "@/components/summary-card-report";
import { SummaryCardsSkeleton } from "@/components/summary-cards/skeleton";
import WinningPartyCardStat from "@/components/winning-party-card-stat";
import { useDistrict } from "@/services/district";

interface DistrictTotalVotesProps {
	districtId: string;
}

const getDistrictNationalRank = (districtNationalRank: number) => {
	if (districtNationalRank === 1) return "1st largest voting district";
	if (districtNationalRank === 2) return "2nd largest voting district";
	if (districtNationalRank === 3) return "3rd largest voting district";
	return `${districtNationalRank}th largest voting district`;
};

const DistrictTotalVotes = ({ districtId }: DistrictTotalVotesProps) => {
	const { data, isPending, error } = useDistrict(districtId);

	if (isPending) return <SummaryCardsSkeleton />;
	if (error || !data) return <div>Error: {error?.message}</div>;
	if (!data.data) return <div>No data</div>;

	const totalVotes = data.data.total_votes.total_national_votes;
	const nationalVotePercentage =
		(data.data.total_votes.total_votes / totalVotes) * 100;

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "row",
				gap: "10px",
				width: "100%",
			}}
		>
			<SummaryCardReport title="Votes">
				<SummaryCardReport.Stat
					value={Intl.NumberFormat("en-US").format(
						data.data.total_votes.total_votes,
					)}
					label="Participating Citizens"
				/>
			</SummaryCardReport>

			<SummaryCardReport title="Share of National Votes">
				<SummaryCardReport.Stat
					value={nationalVotePercentage.toFixed(2) + "%"}
					label={getDistrictNationalRank(data.data.district_national_rank)}
				/>
			</SummaryCardReport>

			<WinningPartyCardStat
				name={data.data.winning_party.party_name}
				totalVotes={data.data.winning_party.total_votes}
				votePercentage={data.data.winning_party.vote_percentage_share}
			/>
		</div>
	);
};

export default DistrictTotalVotes;
