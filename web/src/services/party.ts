import { getRequest, type IApiResponse } from "@/utils/http";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

interface IVoteDistributionPerParty {
	party_id: string;
	party_name: string;
	total_vote_count: number;
	vote_percentage: number;
}

export const getWinningPartiesOptions: UseQueryOptions<
	IApiResponse<IVoteDistributionPerParty[]>
> = {
	queryKey: ["distributed-votes-per-party"],
	queryFn: () => getRequest("distributed-votes-per-party"),
};

export const useWinningParties = () => {
	return useQuery(getWinningPartiesOptions);
};
