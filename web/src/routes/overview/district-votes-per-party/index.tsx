import SummaryCardReport from '@/components/summary-card-report';
import { formatKNumber } from '@/utils/format-k-number';
import { getRequest } from '@/utils/http';
import { Column } from '@ant-design/charts';
import { useQuery } from '@tanstack/react-query';

const DistrictsVotesPerParty = () => {
  const {data, isPending} = useQuery({
    queryKey: ['districts-votes-per-party'],
    queryFn: () => getRequest('districts'),
  })

  if (isPending) return <div>Loading...</div>
  if (!data) return <div>No data</div>

  let result = [];

  for (const district of data.data) {
    let data = {
      name: district.name,
      party: 'N/A',
      votes: 0,
    }

    for (const vote of district.votes) {
      let newData = {
        ...data,
      }
      newData.votes = vote.total_vote_count;
      newData.party = vote.party.name;
      result.push(newData);
    }
  }

  console.log(result);

  const config = {
		data: result,
		xField: "name",
		yField: "votes",
		colorField: "party",
		stack: true,
		interaction: {
			tooltip: {
				render: (_, { title, items }) => {
					return (
						<div key={title}>
              <p style={{ marginBottom: 12, fontWeight: 'bold', fontSize: 16 }}>{title}</p>

							{items.map((item) => {
								const { name, value, color } = item;
								return (
									<div>
										<div
											style={{
												margin: 0,
												display: "flex",
												justifyContent: "space-between",
											}}
										>
											<div>
												<span
													style={{
														display: "inline-block",
														width: 6,
														height: 6,
														borderRadius: "50%",
														backgroundColor: color,
														marginRight: 6,
													}}
												></span>
												<span>{name}</span>
											</div>
											<b>{formatKNumber(value)}</b>
										</div>
									</div>
								);
							})}
						</div>
					);
				},
			},
		},
  };

  return (
		<SummaryCardReport title="District Votes Per Party">
			<Column {...config} />
		</SummaryCardReport>
	);
}


export default DistrictsVotesPerParty