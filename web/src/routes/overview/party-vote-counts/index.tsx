import SummaryCardReport from "@/components/summary-card-report";
import { useWinningParties } from "@/services/party";
import { formatKNumber } from "@/utils/format-k-number";
import { Pie, type PieConfig } from "@ant-design/charts";
import { Skeleton as AntdSkeleton, Empty } from "antd";



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
				style={{ width: "300px", height: "300px" }}
			/>
		</div>
	);
};

const VoteCounts = () => {
	const { data, error, isPending } = useWinningParties();

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
				return formatKNumber(Number(value));
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
		<SummaryCardReport title="Total Votes per Party">
			<Pie {...config} />
		</SummaryCardReport>
	);
};

export default VoteCounts;
