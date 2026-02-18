import DistrictHistoricalVotes from "@/components/district-historical-votes";
import { useGlobalHistoricalVotes } from "@/services/use-historical-votes";

const OverviewHistoricalVotes = () => {
	const query = useGlobalHistoricalVotes();
	return <DistrictHistoricalVotes {...query} />;
};

export default OverviewHistoricalVotes;
