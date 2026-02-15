import type { IParty, IVote } from "@/types";
import { getRequest } from "@/utils/http";
import { useQuery } from "@tanstack/react-query";

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

export const useFindDistrict = (districtId: string) => {
	return useQuery({
		queryKey: ["districts", districtId],
		queryFn: () => getRequest<IGetDistrictResponse>(`districts/${districtId}`),
	})
};
