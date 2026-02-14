import type { PropsWithChildren } from "react";
import styles from "./styles.module.css";
import { Typography } from "antd";

interface SummaryCardReportProps extends PropsWithChildren {
  title: string;
}

const SummaryCardReport = ({ children, title }: SummaryCardReportProps) => {
	return <div className={styles.root}>
    <div className={styles.body}>
      <Typography.Title level={4}>{title}</Typography.Title>
      {children}
    </div>
  </div>;
};

export default SummaryCardReport;

