import { Typography } from 'antd';


import styles from './generic-summary-list.module.css';

interface SummaryDataListProps {
	report: { name: string; total: number; id: string }[] | null;
}

const SummaryDataList = ({ report }: SummaryDataListProps) => {
  if (!report) return <> Shit </>;

  return (
    <div className={styles.summaryDataList}>
      {report.map(({ name, total }, idx) => (
        <div className={styles.summaryDataItem}>
          <Typography.Paragraph>
            {idx + 1}. {name}
          </Typography.Paragraph>
          <Typography.Paragraph>
            {total}
          </Typography.Paragraph>
        </div>
      ))}
    </div>
  );
};

export default SummaryDataList;
