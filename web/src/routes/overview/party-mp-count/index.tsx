import SummaryCardReport from "@/components/summary-card-report";
import SummaryDataList from "../generic-summary-list/list";
import { useQuery } from "@tanstack/react-query";
import { getRequest } from "@/utils/http";
import GenericSummaryListSkeleton from "../generic-summary-list/generic-summary-list.skeleton";

interface IPartyMPCount {
	party_name: string;
	party_id: string;
	mp_count: number;
}

const PartyMPCount = () => {
	const { data, isLoading, error } = useQuery({
		queryKey: ["party-mp-count"],
		queryFn: () => getRequest<IPartyMPCount[]>("mp-per-party"),
	});

	if (isLoading) {
		return <GenericSummaryListSkeleton />;
	}

	if (error || !data) {
		return <></>;
	}

	return (
		<SummaryCardReport title="MP per Party">
			<SummaryDataList
				report={(data?.data ?? []).map((item) => ({
					name: item.party_name,
					total: item.mp_count,
					id: item.party_id,
				}))}
			/>
		</SummaryCardReport>
	);
};

export default PartyMPCount;
