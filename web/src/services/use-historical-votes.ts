import type { IDistrict, IHistoricalVote, IParty } from "@/types";
import { getRequest } from "@/utils/http";
import { useQuery } from "@tanstack/react-query";

interface IFindHistoricalVotesResponse extends IHistoricalVote {
	party: IParty;
	district: IDistrict;
}

export const getUseGlobalHistoricalVotesOptions = () => {
	return {
		queryKey: ["historical-votes"],
		queryFn: () => getRequest<IFindHistoricalVotesResponse[]>("history"),
	};
};

export const useGlobalHistoricalVotes = () => {
	return useQuery(getUseGlobalHistoricalVotesOptions());
};