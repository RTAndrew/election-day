import DistrictHistoricalVotes from "@/components/district-historical-votes";
import { useFindDistrictHistoricalVotes } from "@/services/district";

interface DistrictHistoricalVotesWrapperProps {
	districtId: string;
}

const DistrictHistoricalVotesWrapper = ({
	districtId,
}: DistrictHistoricalVotesWrapperProps) => {
	const query = useFindDistrictHistoricalVotes(districtId);
	return <DistrictHistoricalVotes {...query} />;
};

export default DistrictHistoricalVotesWrapper;
