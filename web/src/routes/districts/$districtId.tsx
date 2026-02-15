
import { createFileRoute } from '@tanstack/react-router'
import { Col, Row } from 'antd';
import DistrictTotalVotes from './components/total-votes';
import DistrictVotesPerParty from './components/district-votes-per-party';

export const Route = createFileRoute('/districts/$districtId')({
  component: RouteComponent,
})

function RouteComponent() {
  const {districtId} = Route.useParams();
  return (
		<Row gutter={[12, 12]}>
			<Col xs={24} sm={12} md={12} lg={10} xl={4}>
				<DistrictTotalVotes districtId={districtId} />
			</Col>
			<Col xs={24} sm={12} md={12} lg={10} xl={6}>
				<DistrictVotesPerParty districtId={districtId} />
			</Col>
		</Row>
	);
}
