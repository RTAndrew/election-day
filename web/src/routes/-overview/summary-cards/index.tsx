import { SummaryCards } from "@/components/summary-cards";
import { SummaryCardsSkeleton } from "@/components/summary-cards/skeleton";
import { useParties } from "@/services/party";
import { useMemo } from "react";

export const OverViewSummaryCards = () => {
	const { data, error, isPending } = useParties();

	const values = useMemo(() => {
		const [foundParty] = (data?.data ?? []).sort(
			(a, b) => b.total_vote_count - a.total_vote_count,
		);

		const totalVotes =
			data?.data?.reduce((acc, curr) => acc + curr.total_vote_count, 0) ?? 0;

		const winningParty = {
			name: foundParty?.name ?? "",
			totalVotes: foundParty?.total_vote_count ?? 0,
			votePercentage: foundParty?.vote_percentage ?? 0,
		};
		return { totalVotes, winningParty };
	}, [data]);

	if (isPending) return <SummaryCardsSkeleton />;

	if (error) {
		return <div>Error: {error.message}</div>;
	}

	return (
		<SummaryCards
			totalVotes={values.totalVotes}
			winningParty={values.winningParty}
		/>
	);
};
