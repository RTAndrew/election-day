import type { PartyCode, Prisma } from "../../../prisma/generated/client";
import { getPartyName } from "../../utils/party-name";
import { generateUUID } from "../../utils/uuid";
import type { ElectionRow } from "../upload-election/parse-election";

export const saveDistrictElection = async (
	election: ElectionRow,
	voteBatchId: string,
	tx: Prisma.TransactionClient,
) => {
	let totalVotes = 0;
	// 1. Create district if it doesn't exist
	let existingDistrict = await tx.districts.findUnique({
		where: {
			name: election.district,
		},
	});

	if (!existingDistrict) {
		existingDistrict = await tx.districts.create({
			data: {
				id: generateUUID("district"),
				name: election.district,
			},
		});
	}

	for (const vote of election.votes) {
		totalVotes += vote.vote_count;

		// 2. Create party if it doesn't exist
		let existingParty = await tx.parties.findUnique({
			where: {
				code: vote.party_code.toUpperCase() as `${PartyCode}`,
			},
		});

		if (!existingParty) {
			existingParty = await tx.parties.create({
				data: {
					id: generateUUID("party"),
					name: getPartyName(vote.party_code),
					code: vote.party_code.toUpperCase() as `${PartyCode}`,
				},
			});
		}

		// 3. Create vote history (seed can pass recorded_at → stored in createdAt)
		const createdVoteHistory = await tx.voteHistories.create({
			data: {
				id: generateUUID("vh"),
				party_id: existingParty.id,
				vote_batch_id: voteBatchId,
				vote_count: vote.vote_count,
				district_id: existingDistrict.id,
				...(election.recorded_at && {
					createdAt: new Date(election.recorded_at),
					updatedAt: new Date(election.recorded_at),
				}),
			},
		});

		// 4. Create or update vote
		await tx.votes.upsert({
			where: {
				vote_unique_id: {
					party_id: existingParty.id,
					district_id: existingDistrict.id,
				},
			},
			create: {
				id: generateUUID("v"),
				party_id: existingParty.id,
				district_id: existingDistrict.id,
				total_vote_count: vote.vote_count,
				last_vote_history_id: createdVoteHistory.id,
			},
			update: {
				total_vote_count: {
					set: vote.vote_count,
				},
				last_vote_history_id: createdVoteHistory.id,
			},
		});

		// 5. Update district total vote count based on votes
		const votes = await tx.votes.findMany({
			where: {
				district_id: existingDistrict.id,
			},
			select: {
				total_vote_count: true,
			},
		});

		const totalVoteCount = votes.reduce(
			(acc, vote) => acc + vote.total_vote_count,
			0,
		);

		await tx.districts.update({
			where: {
				id: existingDistrict.id,
			},
			data: {
				total_vote_count: totalVoteCount,
			},
		});
	}
};
