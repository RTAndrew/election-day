
import { createFileRoute } from '@tanstack/react-router'
import { Col, Row } from 'antd';
import DistrictTotalVotes from "./-components/total-votes";
import DistrictVotesPerParty from "./-components/district-votes-per-party";
import DistrictHistoricalVotes from "./-components/historical-votes";
import ScreenHeader from "@/components/screen-header";
import { getRequest } from "@/utils/http";
import type { IGetDistrictResponse } from "@/services/district";

export const Route = createFileRoute("/districts/$districtId")({
	component: RouteComponent,
	loader: async ({ params }) => {
		const { districtId } = params;
		const { data } = await getRequest<IGetDistrictResponse>(
			`districts/${districtId}`,
		);
		return { district: data };
	},
});

function RouteComponent() {
  const {districtId} = Route.useParams();
  const { district } = Route.useLoaderData();

  return (
		<>
			<ScreenHeader title={`District: ${district?.name ?? districtId}`} />

			<Row gutter={[12, 12]}>
				<Col xs={24} sm={24} md={24} lg={24} xl={24}>
					<DistrictTotalVotes districtId={districtId} />
				</Col>
				<Col xs={24} sm={24} md={8} lg={8} xl={6}>
					<DistrictVotesPerParty districtId={districtId} />
				</Col>
				<Col xs={24} sm={24} md={16} lg={16} xl={18}>
					<DistrictHistoricalVotes districtId={districtId} />
				</Col>
			</Row>
		</>
	);
}
