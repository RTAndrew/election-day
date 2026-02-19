import { useDistricts } from "@/services/district";
import { LisbonJSXMap } from "./map/map-as-jsx";

import { useMemo } from "react";
import { useParties } from "@/services/party";
import styles from "./styles.module.css";
import { Empty, Typography } from "antd";
import Loading from "@/components/loading";
const slugify = (str: string) => {
	return str
		.normalize("NFD") // remove accents
		.replace(/\p{M}/gu, "") // "a", "ç" -> "c"
		.toLowerCase()
		.replace(/ /g, "-");
};

const partyColors: Record<string, string> = {
	PSD: "#c98b5c",
	PS: "#b86b6b",
	IL: "#c9a84a",
	CH: "#6b8fb8",
	PAN: "#6b9e6b",
	L: "#6b9a9e",
	BE: "#a86b82",
};

export const getPartyColor = (partyCode: string) => {
	const code = partyCode.toUpperCase() as string;
	return partyColors[code] ?? "#757575";
};

export interface IMapDistrict {
	id: string;
	name: string;
	slug: string;
	winningParty: {
		id: string;
		name: string;
		color: string;
		votes: number;
	};
}

const LisbonMap = () => {
	const { data, isPending, error } = useDistricts();
	const {
		data: partiesData,
		isPending: isPartiesPending,
		error: partiesError,
	} = useParties();

	const mappedDistricts = useMemo(() => {
		return (data?.data ?? []).map((district) => {
			const winningParty = district.votes.sort(
				(a, b) => b.total_vote_count - a.total_vote_count,
			)[0];

			return {
				id: district.id,
				name: district.name,
				slug: slugify(district.name),
				winningParty: {
					id: winningParty.party.id,
					name: winningParty.party.name,
					color: getPartyColor(winningParty.party.code),
					votes: winningParty.total_vote_count,
				},
			};
		});
	}, [data]);

	if (isPending || isPartiesPending) {
		return <Loading fullWidth />;
	}

	if (error || partiesError) {
		return <Empty description="An error occurred while loading the data." />;
	}


	return (
		<div className={styles.lisbonMap}>
			<div>
				<Typography.Title level={2}>Legend</Typography.Title>

				{partiesData?.data && partiesData?.data?.length > 0 ? (
					<>
						<div className={styles.partyList}>
							{partiesData?.data?.map((party) => (
								<div key={party.id} className={styles.party}>
									<span
										className={styles.partyColorAdorning}
										style={{ backgroundColor: getPartyColor(party.code) }}
									/>

									<span className="party-name">
										<b>{party.code}</b>
										{" - "}
										<span>{party.name}</span>
									</span>
								</div>
							))}
						</div>
					</>
				) : (
					<Typography.Paragraph>
						No votes have been registered yet.{" "}
					</Typography.Paragraph>
				)}
			</div>

			<LisbonJSXMap districts={mappedDistricts} />
		</div>
	);
};

export default LisbonMap;
