import type { IDistrict, IHistoricalVote, IParty } from "@/types";
import { getRequest } from "@/utils/http";
import { useQuery } from "@tanstack/react-query";

interface IFindHistoricalVotesResponse extends IHistoricalVote {
  party: IParty;
  district: IDistrict;
}

export const useFindHistoricalVotes = () => {
	return useQuery({
		queryKey: ["historical-votes"],
		queryFn: () => getRequest<IFindHistoricalVotesResponse[]>("history"),
	});
};