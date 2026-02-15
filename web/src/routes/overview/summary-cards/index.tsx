import SummaryCardReport from '@/components/summary-card-report'
import { Row } from 'antd'

export const OverViewSummaryCards = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <SummaryCardReport title="Total Citizen Votes">
        aas
      </SummaryCardReport>
      <SummaryCardReport title="Winning Party">
        PSD
      </SummaryCardReport>
    </div>
  )
}