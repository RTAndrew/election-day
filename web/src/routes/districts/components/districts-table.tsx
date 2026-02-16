import { useDistricts } from "@/services/district";
import { Link } from "@tanstack/react-router";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";

interface DistrictTableProps {
	pagination?: number;
}

const DistrictTable = ({ pagination }: DistrictTableProps) => {
	const { data, isPending, error } = useDistricts();

	const totalNationalVotes =
		data?.data?.reduce((acc, district) => acc + district.total_vote_count, 0) ??
		0;


	if (!data || error) return <div>No data</div>;

	const columns: ColumnsType<NonNullable<typeof data.data>[number]> = [
    {
      key: "id",
      title: "#",
      dataIndex: "id",
      width: 10,
      align: "left",
      render: (_, __, index) => index + 1,
    },
		{
			key: "name",
			title: "Name",
			dataIndex: "name",
			sorter: (a, b) => a.name.localeCompare(b.name),
			render: (_, district) => (
				<Link
					to={`/districts/$districtId`}
					params={{ districtId: district.id }}
				>
					{district.name}
				</Link>
			),
		},
		{
			key: "total_vote_count",
			title: "Total Votes",
			dataIndex: "total_vote_count",
			defaultSortOrder: "descend",
			align: "right",
			sorter: (a, b) => a.total_vote_count - b.total_vote_count,
			render: (_, district) => district.total_vote_count.toLocaleString(),
		},
		{
			title: "National Vote Share",
			dataIndex: "national_vote_share",
			key: "national_vote_share",
			align: "right",
			render: (_, district) =>
				((district.total_vote_count / totalNationalVotes) * 100).toFixed(2) +
				"%",
		},
	];

	return <Table pagination={{ pageSize: pagination ?? 10 }} loading={isPending} virtual dataSource={data.data ?? []} columns={columns} />;
};

export default DistrictTable;
