import { createFileRoute } from "@tanstack/react-router";
import PartyVoteCounts from "./overview/party-vote-counts";
import PartyMPCount from "./overview/party-mp-count";
import { OverViewSummaryCards } from "./overview/summary-cards";
import DistrictsVotesPerParty from "./overview/district-votes-per-party";
import { Col } from "antd";
import { Row } from "antd";

export const Route = createFileRoute("/")({ component: App });

function App() {
	return (
		<Row gutter={[12, 12]}>
			<Col xs={24} sm={12} md={12} lg={10} xl={4} xxl={4}>
				<OverViewSummaryCards />
			</Col>

			<Col xs={24} sm={12} md={12} lg={10} xl={5} xxl={5}>
				<PartyMPCount />
			</Col>
			<Col xs={24} sm={12} md={12} lg={10} xl={6} xxl={6}>
				<PartyVoteCounts />
			</Col>
			<Col xs={24} sm={12} md={12} lg={10} xl={8} xxl={8}>
				<DistrictsVotesPerParty />
			</Col>
		</Row>
	);
}
