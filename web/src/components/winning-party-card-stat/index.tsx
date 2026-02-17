
import SummaryCardReport from '../summary-card-report';
import styles from './styles.module.css';

interface WinningPartyCardStatProps {
	name: string;
	totalVotes: number;
	votePercentage: number;
}

const WinningPartyCardStat = ({ name, totalVotes, votePercentage }: WinningPartyCardStatProps) => {
  return (
		<>
			<SummaryCardReport title="Winning Party">
				<p className={styles.partyName}>{name}</p>
				<div className={styles.statList}>
					<SummaryCardReport.Stat
						value={Intl.NumberFormat("en-US").format(totalVotes)}
						label="Votes"
					/>
					<SummaryCardReport.Stat
						value={`${votePercentage}%`}
						label="Turnout"
					/>
				</div>
			</SummaryCardReport>
		</>
	);
}

export default WinningPartyCardStat