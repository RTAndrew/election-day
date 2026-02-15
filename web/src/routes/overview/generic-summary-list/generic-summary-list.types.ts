import { ReactNode } from 'react';
import { TGetTopListSummaryReport } from 'services/reports';

export interface GenericSummaryListProps {
  title: ReactNode;
  fetcher: TGetTopListSummaryReport;
}
