import DistrictsVotesPerParty from "@/components/district-votes-per-party";
import { createFileRoute } from "@tanstack/react-router";
import DistrictTable from "./components/districts-table";
import { Col, Row } from "antd";

export const Route = createFileRoute("/districts/")({
	component: Districts,
});

function Districts() {
	return (
		<Row gutter={[12, 12]}>
			<Col span={24}>
				<DistrictsVotesPerParty />
			</Col>

			<Col span={24}>
				<DistrictTable />
			</Col>
		</Row>
	);
}
