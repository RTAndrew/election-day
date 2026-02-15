import DistrictsVotesPerParty from "@/components/district-votes-per-party";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/districts/")({
	component: Districts,
});

function Districts() {
	return <DistrictsVotesPerParty districtId="district_f7e1mybrgx" />;
}
