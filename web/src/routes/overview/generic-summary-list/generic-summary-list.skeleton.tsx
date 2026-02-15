import { Skeleton } from 'antd';

import styles from './generic-summary-list.module.css';

const GenericSummaryListSkeleton = () => {
  return (
    <div style={{ display: 'flex', gap: '5px' }}>
      <Skeleton paragraph={{ rows: 8 }} active className={styles.skeleton} />
    </div>
  );
};

export default GenericSummaryListSkeleton;
