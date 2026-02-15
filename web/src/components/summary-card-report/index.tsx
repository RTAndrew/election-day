import type { PropsWithChildren } from "react";
import styles from "./styles.module.css";

interface SummaryCardReportProps extends PropsWithChildren {
  title: string;
}

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

export default SummaryCardReport;

