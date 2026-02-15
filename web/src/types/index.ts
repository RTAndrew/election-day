export interface IDistrict {
	id: string;
	name: string;
	total_vote_count: number;
	updatedAt: string;
	createdAt: string;
}

export interface IParty {
	id: string;
	code: string;
	name: string;
	updatedAt: string;
	createdAt: string;
}

export interface IVote {
	id: string;
	party_id: string;
	district_id: string;
	total_vote_count: number;
	last_vote_history_id: string;
	updatedAt: string;
	createdAt: string;
}

export interface IHistoricalVote {
	id: string;
	date: string;
	vote_count: number;
	party_id: string;
	updatedAt: string;
	createdAt: string;
}
