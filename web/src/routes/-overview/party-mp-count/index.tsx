import SummaryCardReport from "@/components/summary-card-report";
import SummaryDataList from "../generic-summary-list/list";
import GenericSummaryListSkeleton from "../generic-summary-list/generic-summary-list.skeleton";
import { Link } from "@tanstack/react-router";
import { useParties } from "@/services/party";
import { Empty } from "antd";

const PartyMPCount = () => {
	const { data, isLoading, error } = useParties();

	if (isLoading) {
		return (
			<SummaryCardReport title="Members of Parliament">
				<GenericSummaryListSkeleton />
			</SummaryCardReport>
		);
	}

	if (error || !data) {
		return <Empty description="An error occurred while fetching the data" />;
	}

	if (data?.data?.length === 0) {
		return (
			<SummaryCardReport title="Members of Parliament">
				<Empty description="No data found" />
			</SummaryCardReport>
		);
	}

	return (
		<SummaryCardReport title="Members of Parliament">
			<SummaryDataList
				report={(data?.data ?? []).map((item) => ({
					name: (
						<Link to={`/party/$partyId`} params={{ partyId: item.id }}>
							{item.name}
						</Link>
					),
					total: item.mp_count,
					id: item.id,
				}))}
			/>
		</SummaryCardReport>
	);
};

export default PartyMPCount;
