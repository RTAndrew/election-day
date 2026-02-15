import { createFileRoute } from "@tanstack/react-router";
import PartyVoteCounts from "./overview/party-vote-counts";
import PartyMPCount from "./overview/party-mp-count";
import { OverViewSummaryCards } from "./overview/summary-cards";
import DistrictsVotesPerParty from "../components/district-votes-per-party";
import { Col } from "antd";
import { Row } from "antd";
import OverviewHistoricalVotes from "./overview/historical-votes";

export const Route = createFileRoute("/")({ component: App });

function App() {
	return (
		<Row gutter={[12, 12]}>
			<Col xs={24} sm={12} md={12} lg={5}>
				<div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
					<OverViewSummaryCards />
					<PartyMPCount />
				</div>
			</Col>
			<Col xs={24} sm={12} md={12} lg={5}>
				<PartyVoteCounts />
			</Col>
			<Col xs={24} sm={12} md={12} lg={14}>
				<DistrictsVotesPerParty districtId="s" />
			</Col>
			<Col xs={24} sm={24} md={24} lg={24} xl={24}>
				<OverviewHistoricalVotes />
			</Col>
		</Row>
	);
}
