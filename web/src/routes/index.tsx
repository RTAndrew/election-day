import { createFileRoute } from "@tanstack/react-router";
import PartyVoteCounts from "./overview/party-vote-counts";
import PartyMPCount from "./overview/party-mp-count";
import { OverViewSummaryCards } from "./overview/summary-cards";
import DistrictsVotesPerParty from "../components/district-votes-per-party";
import { Col } from "antd";
import { Row } from "antd";
import OverviewHistoricalVotes from "./overview/historical-votes";
import DistrictTable from "./districts/components/districts-table";
import SummaryCardReport from "@/components/summary-card-report";
import ScreenHeader from "@/components/screen-header";

export const Route = createFileRoute("/")({ component: App });

function App() {
	return (
		<>
			<ScreenHeader title="Overview" />

			<Row gutter={[12, 12]}>
				<Col xs={24} sm={12} md={12} lg={6}>
					<div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
						<OverViewSummaryCards />
						<PartyMPCount />
					</div>
				</Col>
				<Col xs={24} sm={12} md={12} lg={7}>
					<PartyVoteCounts />
				</Col>
				<Col xs={24} sm={12} md={12} lg={11}>
					<DistrictsVotesPerParty districtId="s" />
				</Col>
				<Col xs={24} sm={24} md={24} lg={12}>
					<OverviewHistoricalVotes />
				</Col>
				<Col xs={24} sm={24} md={24} lg={12}>
					<SummaryCardReport title="Districts">
						<DistrictTable pagination={6} />
					</SummaryCardReport>
				</Col>
			</Row>
		</>
	);
}
