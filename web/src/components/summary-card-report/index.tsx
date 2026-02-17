import type { PropsWithChildren } from "react";
import styles from "./styles.module.css";
import { Flex } from "antd";
import type { Orientation } from "antd/es/_util/hooks";

interface SummaryCardReportProps extends PropsWithChildren {
  title: string;
}


const Stat = ({ value, label }: { value: number | string; label?: string }) => (
	<div className={styles.stat}>
		<p className={styles.statValue}>{value}</p>
		{label && <p className={styles.statLabel}>{label}</p>}
	</div>
);

interface StatGroupProps extends PropsWithChildren {
	direction?: Orientation;
}

const StatGroup = ({ children, direction = "vertical" }: StatGroupProps) => (
	<Flex orientation={direction} gap={12}>
		{children}
	</Flex>
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
SummaryCardReport.StatGroup = StatGroup;
export default SummaryCardReport;

