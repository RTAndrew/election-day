import type { IHistoricalVote, IParty, IVote } from "@/types";
import { buildAPIQueries, getRequest, type IApiResponse } from "@/utils/http";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

interface IGetDistrictResponse {
	winning_party: {
		party_id: string;
		party_name: string;
		total_votes: number;
		vote_percentage_share: number;
	};
	total_votes: {
		total_votes: number;
		national_vote_share: number;
	};
	votes_per_party: (IVote & { party: IParty })[];
}

interface IFindDistrictHistoricalVotesResponse extends IHistoricalVote {
	party: IParty;
}

export const useFindDistrict = (districtId: string) => {
	return useQuery({
		queryKey: ["districts", districtId],
		queryFn: () => getRequest<IGetDistrictResponse>(`districts/${districtId}`),
	});
};

export const useFindDistrictHistoricalVotes = (districtId: string) => {
	return useQuery({
		queryKey: ["districts", districtId, "historical-votes"],
		queryFn: () =>
			getRequest<IFindDistrictHistoricalVotesResponse[]>(
				`districts/${districtId}/history`,
			),
	});
};

export const getDistributedVotesPerPartyOptions = (
	districtId: string | undefined,
) =>
	({
		queryKey: ["distributed-votes-per-party"], // no ID just to be easier to revalidate on SSE
		queryFn: () =>
			getRequest(buildAPIQueries("districts", { district_id: districtId })),
	}) as UseQueryOptions<IApiResponse<unknown>>;

export const useDistributedVotesPerParty = (districtId: string | undefined) => {
	return useQuery(getDistributedVotesPerPartyOptions(districtId));
};
