import SummaryCardReport from "@/components/summary-card-report";
import { SummaryCardsSkeleton } from "./skeleton";

import styles from "./styles.module.css";
import WinningPartyCardStat from "../winning-party-card-stat";

export interface SummaryCardsWinningParty {
	name: string;
	totalVotes: number;
	votePercentage: number;
}

export interface SummaryCardsProps {
	loading?: boolean;
	totalVotes: number;
	direction?: "horizontal" | "vertical";
	winningParty: SummaryCardsWinningParty;
}


export const SummaryCards = ({
	totalVotes,
	winningParty,
	loading = false,
	direction = "vertical",
}: SummaryCardsProps) => {
	if (loading) {
		return <SummaryCardsSkeleton />;
	}

	return (
		<div style={{ display: "flex", flexDirection: direction === "horizontal" ? "row" : "column", gap: "10px" }}>
			<SummaryCardReport title="Votes">
				<SummaryCardReport.Stat
					value={Intl.NumberFormat("en-US").format(totalVotes)}
					label="Participating Citizens"
				/>
			</SummaryCardReport>

			<WinningPartyCardStat name={winningParty.name} totalVotes={winningParty.totalVotes} votePercentage={winningParty.votePercentage} />
		</div>
	);
};
