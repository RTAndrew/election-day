import ScreenHeader from "@/components/screen-header";
import SummaryCardReport from "@/components/summary-card-report";
import { useParty } from "@/services/party";
import { createFileRoute } from "@tanstack/react-router";
import { Col, Row } from "antd";
import PartyHistoricalVotes from "./-history";

export const Route = createFileRoute("/party/$partyId")({
	component: RouteComponent,
});

function RouteComponent() {
	const { partyId } = Route.useParams();

	const { data, isPending, error } = useParty(partyId);

	if (isPending) return <> Loading party... </>;

	if (error || !data?.data) return <> Error loading party </>;

	const {
		name,
		total_vote_count,
		mp_count,
		vote_percentage,
		strongest_district,
		weakest_district,
	} = data?.data;

	return (
		<>
			<ScreenHeader title={`Party: ${name}`} />

			<Row gutter={[12, 12]}>
				<Col sm={24} md={12} lg={6}>
					<SummaryCardReport title="Total Votes">
						<SummaryCardReport.Stat value={total_vote_count} />
					</SummaryCardReport>
				</Col>
				<Col sm={24} md={12} lg={6}>
					<SummaryCardReport title="Turnout">
						<SummaryCardReport.Stat value={vote_percentage} />
					</SummaryCardReport>
				</Col>
				<Col sm={24} md={12} lg={6}>
					<SummaryCardReport title="Parliament Seats">
						<SummaryCardReport.Stat value={mp_count} />
					</SummaryCardReport>
				</Col>
				<Col sm={24} md={12} lg={6}>
					<SummaryCardReport title="Districts Won/Lost">
						<SummaryCardReport.Stat value={mp_count} />
					</SummaryCardReport>
				</Col>

				<Col sm={24} md={12} lg={6}>
					<SummaryCardReport title="Perfomance">
						<SummaryCardReport.StatGroup direction="vertical">
							{strongest_district && (
								<SummaryCardReport.Stat
									value={strongest_district?.name}
									label="Strongest District"
								/>
							)}
							{weakest_district && (
								<SummaryCardReport.Stat
									value={weakest_district?.name}
									label="Weakest District"
								/>
							)}
						</SummaryCardReport.StatGroup>
					</SummaryCardReport>
				</Col>
        <Col sm={24} md={24} lg={24}>
          <PartyHistoricalVotes partyId={partyId} />
        </Col>
      </Row>

		</>
	);
}
