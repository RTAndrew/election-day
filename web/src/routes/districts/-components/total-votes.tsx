import SummaryCardReport from "@/components/summary-card-report";
import { SummaryCardsSkeleton } from "@/components/summary-cards/skeleton";
import WinningPartyCardStat from "@/components/winning-party-card-stat";
import { useDistrict } from "@/services/district";
import { Col, Row } from "antd";

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
		<Row gutter={[12, 12]}>
			<Col xs={24} sm={12} lg={8}>
				<SummaryCardReport title="Votes">
					<SummaryCardReport.Stat
						value={Intl.NumberFormat("en-US").format(
							data.data.total_votes.total_votes,
						)}
						label="Participating Citizens"
					/>
				</SummaryCardReport>
			</Col>
			<Col xs={24} sm={12} lg={8}>
				<SummaryCardReport title="Share of National Votes">
					<SummaryCardReport.Stat
						value={nationalVotePercentage.toFixed(2) + "%"}
						label={getDistrictNationalRank(data.data.district_national_rank)}
					/>
				</SummaryCardReport>
			</Col>
			<Col xs={24} sm={12} lg={8}>
				<WinningPartyCardStat
					name={data.data.winning_party.party_name}
					totalVotes={data.data.winning_party.total_votes}
					votePercentage={data.data.winning_party.vote_percentage_share}
				/>
			</Col>
		</Row>
	);
};

export default DistrictTotalVotes;
