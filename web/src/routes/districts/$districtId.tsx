
import { createFileRoute } from '@tanstack/react-router'
import { Col, Row } from 'antd';
import DistrictTotalVotes from './components/total-votes';
import DistrictVotesPerParty from './components/district-votes-per-party';
import DistrictHistoricalVotes from "./components/historical-votes";

export const Route = createFileRoute('/districts/$districtId')({
  component: RouteComponent,
})

function RouteComponent() {
  const {districtId} = Route.useParams();
  return (
		<div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
			<Row gutter={[12, 12]}>
				<Col xs={24} sm={12} md={12} lg={10} xl={4}>
					<DistrictTotalVotes districtId={districtId} />
				</Col>
				<Col xs={24} sm={12} md={12} lg={10} xl={6}>
					<DistrictVotesPerParty districtId={districtId} />
				</Col>
			</Row>

			<Row gutter={[12, 12]}>
				<Col xs={24} sm={24} md={24} lg={24} xl={24}>
					<DistrictHistoricalVotes districtId={districtId} />
				</Col>
			</Row>
		</div>
	);
}
