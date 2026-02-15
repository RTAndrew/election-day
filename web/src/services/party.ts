import { getRequest } from "@/utils/http";
import { useQuery } from "@tanstack/react-query";

interface IVoteDistributionPerParty {
	party_id: string;
	party_name: string;
	total_vote_count: number;
	vote_percentage: number;
}

export const useWinningParties= () => {
	return useQuery({
		queryKey: ["distributed-votes-per-party"],
		queryFn: () =>
			getRequest<IVoteDistributionPerParty[]>("distributed-votes-per-party"),
	});
};
