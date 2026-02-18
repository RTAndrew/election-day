import type { IDistrict, IHistoricalVote, IParty } from "@/types";
import { getRequest, type IApiResponse } from "@/utils/http";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

interface IGetPartiesResponse extends IParty {
	mp_count: number;
	total_vote_count: number;
	vote_percentage: number;
	strongest_district: IDistrict | null;
	weakest_district: IDistrict | null;
}

// PARTY
export const getUsePartyOptions = (
	partyId: string,
): UseQueryOptions<IApiResponse<IGetPartiesResponse>> => ({
	queryKey: ["party", partyId],
	queryFn: () => getRequest(`parties/${partyId}`),
});

export const useParty = (partyId: string) => {
	return useQuery(getUsePartyOptions(partyId));
};

// PARTIES
export const getUsePartiesOptions = (): UseQueryOptions<IApiResponse<IGetPartiesResponse[]>> => ({
	queryKey: ["parties"],
	queryFn: () => getRequest("parties"),
});

export const useParties = () => {
	return useQuery(getUsePartiesOptions());
};

// PARTY HISTORY VOTES
export const getUsePartyHistoricalVotesOptions = (
	partyId: string,
): UseQueryOptions<IApiResponse<IHistoricalVote[]>> => ({
	queryKey: ["party", partyId, "history"],
	queryFn: () => getRequest(`parties/${partyId}/history`),
});

export const usePartyHistoricalVotes = (partyId: string) => {
	return useQuery(getUsePartyHistoricalVotesOptions(partyId));
};
