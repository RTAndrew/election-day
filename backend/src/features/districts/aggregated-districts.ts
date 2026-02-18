import { prisma } from "../../utils/database.js";

interface AggregatedDistrictRow {
  district_total_votes: number;
  national_vote_share: number;
}

export const aggregatedDistricts = async (districtId: string) => {
  const rows = await prisma.$queryRaw<AggregatedDistrictRow[]>`
    WITH totals AS (
      SELECT COALESCE(SUM(total_vote_count), 0)::bigint AS district_total_votes
      FROM "Votes"
      WHERE district_id = ${districtId}
    ),
    national AS (
      SELECT COALESCE(SUM(total_vote_count), 0)::bigint AS national_total_votes
      FROM "Votes"
    )
    SELECT
      t.district_total_votes::int AS district_total_votes,
      ROUND(
        100.0 * t.district_total_votes / NULLIF(n.national_total_votes, 0),
        2
      )::float AS national_vote_share
    FROM totals t
    CROSS JOIN national n
  `;

  const row = rows[0];
  return {
    district_total_vote_count: row?.district_total_votes ?? 0,
    national_vote_share: Number(row?.national_vote_share ?? 0),
  };
};