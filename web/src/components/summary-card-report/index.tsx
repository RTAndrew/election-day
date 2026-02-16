import type { PropsWithChildren } from "react";
import styles from "./styles.module.css";

interface SummaryCardReportProps extends PropsWithChildren {
  title: string;
}


const Stat = ({ value, label }: { value: number | string; label: string }) => (
	<div className={styles.stat}>
		<p className={styles.statValue}>{value}</p>
		<p className={styles.statLabel}>{label}</p>
	</div>
);

const SummaryCardReport = ({ children, title }: SummaryCardReportProps) => {
	return (
		<div className={styles.root}>
			<div className={styles.body}>
				<p className={styles.title}>{title}</p>
				{children}
			</div>
		</div>
	);
};

SummaryCardReport.Stat = Stat;

export default SummaryCardReport;

