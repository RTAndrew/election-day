import DistrictHistoricalVotes from "@/components/district-historical-votes";
import { useFindHistoricalVotes } from "@/services/use-historical-votes";

const OverviewHistoricalVotes = () => {
	const query = useFindHistoricalVotes();
	return <DistrictHistoricalVotes {...query} />;
};

export default OverviewHistoricalVotes;
