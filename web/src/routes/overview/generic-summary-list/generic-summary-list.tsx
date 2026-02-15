import { translate } from 'i18nProvider';
import { useCallback, useEffect, useState } from 'react';
import {
  GenericSummaryReport,
  GenericSummaryReportArgs,
} from 'services/reports/summary/summary-reports.types';

import { SummaryReportCardChildrenProps } from '../summary-report-card/summary-report-card.types';
import GenericSummaryListSkeleton from './generic-summary-list.skeleton';
import List from './list';

const GenericList = ({
  date,
  isLoading,
  fetcher,
  onLoading,
  onLoadingCancel,
}: SummaryReportCardChildrenProps) => {
  const [report, setReport] = useState<GenericSummaryReport | null>(null);

  const fetch = useCallback(
    async (value: GenericSummaryReportArgs) => {
      try {
        onLoading();
        if (!fetcher) return;

        const { data } = await fetcher?.(value);
        setReport(data.result);
      } catch (error) {
        console.log(error);
      } finally {
        onLoadingCancel();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useEffect(() => {
    fetch(date);
  }, [date, fetch]);

  if (isLoading) return <GenericSummaryListSkeleton />;

  if (!report || report?.length < 1)
    return (
      <div
        style={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        {translate('alert-message.warning.no-results-found')}
      </div>
    );

  return <List report={report} />;
};

export default GenericList;
