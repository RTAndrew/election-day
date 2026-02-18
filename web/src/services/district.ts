import type { IDistrict, IHistoricalVote, IParty, IVote } from "@/types";
import { getRequest } from "@/utils/http";
import { useQuery } from "@tanstack/react-query";

export interface IGetDistrictResponse extends IDistrict {
	winning_party: {
		party_id: string;
		party_name: string;
		total_votes: number;
		vote_percentage_share: number;
	};
	total_votes: {
		total_votes: number;
		total_national_votes: number;
		national_vote_share: number;
	};
	district_national_rank: number;
	votes_per_party: (IVote & { party: IParty })[];
}

interface IFindDistrictHistoricalVotesResponse extends IHistoricalVote {
	party: IParty;
}

interface IDistrictsResponse extends IDistrict {
	votes: (IVote & { party: IParty })[];
}

// DISTRICT
export const getUseDistrictOptions = (districtId: string) => {
	return {
		queryKey: ["districts", districtId],
		queryFn: () => getRequest<IGetDistrictResponse>(`districts/${districtId}`),
	};
};

export const useDistrict = (districtId: string) => {
	return useQuery(getUseDistrictOptions(districtId));
};

// DISTRICTS LIST
export const getUseDistrictsOptions = () => {
	return {
		queryKey: ["districts"],
		queryFn: () => getRequest<IDistrictsResponse[]>(`districts`),
	};
};

export const useDistricts = () => {
	return useQuery(getUseDistrictsOptions());
};

// HISTORY VOTES
export const getUseDistrictHistoryVotesOptions = (districtId: string) => {
	return {
		queryKey: ["districts", districtId, "history"],
		queryFn: () =>
			getRequest<IFindDistrictHistoricalVotesResponse[]>(
				`districts/${districtId}/history`,
			),
	};
};

export const useDistrictHistoryVotes = (districtId: string) => {
	return useQuery(getUseDistrictHistoryVotesOptions(districtId));
};