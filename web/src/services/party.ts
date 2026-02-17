import type { IDistrict, IHistoricalVote, IParty } from "@/types";
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

interface IGetPartyResponse extends IParty {
	mp_count: number;
	total_vote_count: number;
	vote_percentage: number;
	strongest_district: IDistrict | null;
	weakest_district: IDistrict | null;
}

export const getUsePartyOptions = (
	partyId: string,
): UseQueryOptions<IApiResponse<IGetPartyResponse>> => ({
	queryKey: ["party", partyId],
	queryFn: () => getRequest(`parties/${partyId}`),
});

export const useParty = (partyId: string) => {
	return useQuery(getUsePartyOptions(partyId));
};

export const getUsePartyHistoricalVotesOptions = (
	partyId: string,
): UseQueryOptions<IApiResponse<IHistoricalVote[]>> => ({
	queryKey: ["party", partyId, "history"],
	queryFn: () => getRequest(`parties/${partyId}/history`),
});

export const usePartyHistoricalVotes = (partyId: string) => {
	return useQuery(getUsePartyHistoricalVotesOptions(partyId));
};
