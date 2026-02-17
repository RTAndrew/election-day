import DistrictHistoricalVotes from "@/components/district-historical-votes";
import { preparePartyHistoricalVotesData } from "@/components/district-historical-votes/utils";
import { usePartyHistoricalVotes } from "@/services/party";

const PartyHistoricalVotes = ({ partyId }: { partyId: string }) => {
	const { data, isPending, error } = usePartyHistoricalVotes(partyId as string);

	return (
		<DistrictHistoricalVotes
			data={data}
			isPending={isPending}
			error={error}
			prepareChartData={preparePartyHistoricalVotesData}
			title="History"
		/>
	);
};

export default PartyHistoricalVotes;
