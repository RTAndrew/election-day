import SummaryCardReport from "@/components/summary-card-report";
import { getRequest } from "@/utils/http";
import { Pie, type PieConfig } from "@ant-design/charts";
import { useQuery } from "@tanstack/react-query";
import { Skeleton as AntdSkeleton, Empty } from "antd";

interface IVoteDistributionPerParty {
	party_id: string;
	party_name: string;
	total_vote_count: bigint;
	vote_percentage: number;
}

const Skeleton = () => {
	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				padding: "10px 0",
			}}
		>
			<AntdSkeleton.Avatar
				active
				size="large"
				shape="circle"
				style={{ width: "100px", height: "100px" }}
			/>
		</div>
	);
};

const VoteCounts = () => {
	const { data, error, isPending } = useQuery({
		queryKey: ["distributed-votes-per-party"],
		queryFn: () =>
			getRequest<IVoteDistributionPerParty[]>("distributed-votes-per-party"),
	});

	if (isPending) {
		return <Skeleton />;
	}

	if (error || !data) {
		return <></>;
	}

	if (data.data?.length === 0) {
		return (
			<SummaryCardReport title="Vote Counts">
				<Empty description="No data" />
			</SummaryCardReport>
		);
	}

	const config: PieConfig = {
		innerRadius: 0.5,
		angleField: "value",
		colorField: "type",
		label: {
			text: "total",
			formatter: (value: string) => {
				const formatter = new Intl.NumberFormat("en-US", {
					notation: "compact",
					compactDisplay: "short",
				});
				return `${formatter.format(Number(value))}`;
			},
			style: {
				fontSize: 10,
				fontWeight: "bold",
			},
		},
		data: data?.data?.map((item) => ({
			type: item.party_name,
			value: item.vote_percentage,
			total: item.total_vote_count,
		})),
		tooltip: (data) => {
			return {
				name: data.type,
				value: `${data.value}%`,
			};
		},
	};

	return (
		<SummaryCardReport title="Vote Counts">
			<Pie {...config} />
		</SummaryCardReport>
	);
};

export default VoteCounts;
