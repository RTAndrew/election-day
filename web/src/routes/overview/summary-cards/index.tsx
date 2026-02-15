import SummaryCardReport from '@/components/summary-card-report'
import { useWinningParties } from "@/services/party";
import { useMemo } from "react";

import styles from "./styles.module.css";

const Stat = ({ value, label }: { value: number | string; label: string }) => {
	return (
		<div className={styles.stat}>
			<p className={styles.statValue}>{value}</p>
			<p className={styles.statLabel}>{label}</p>
		</div>
	);
};

export const OverViewSummaryCards = () => {
	const { data, error, isPending } = useWinningParties();

	const { winningParty, totalVotes } = useMemo(() => {
		const [sortedData] = (data?.data ?? []).sort(
			(a, b) => b.total_vote_count - a.total_vote_count,
		);

		const totalVotes =
			data?.data?.reduce((acc, curr) => acc + curr.total_vote_count, 0) ?? 0;

		const winningParty = {
			name: sortedData?.party_name ?? "",
			totalVotes: sortedData?.total_vote_count ?? 0,
			votePercentage: sortedData?.vote_percentage ?? 0,
		};

		return { winningParty, totalVotes };
	}, [data]);

	if (isPending) {
		return <div>Loading...</div>;
	}

	if (error) {
		return <div>Error: {error.message}</div>;
	}

	return (
		<div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
			<SummaryCardReport title="Total Citizen Votes">
				<p className={styles.partyName}>
					{Intl.NumberFormat("en-US").format(totalVotes)}
				</p>
			</SummaryCardReport>

			<SummaryCardReport title="Winning Party">
				<p className={styles.partyName}>{winningParty.name}</p>
				<div className={styles.statList}>
					<Stat
						value={Intl.NumberFormat("en-US").format(winningParty.totalVotes)}
						label="Votes"
					/>
					<Stat value={`${winningParty.votePercentage}%`} label="Percentage" />
				</div>
			</SummaryCardReport>
		</div>
	);
};