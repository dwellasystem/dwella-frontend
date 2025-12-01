import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

type Props = {
  billSummary?: {
    totalDue?: number;
    totalCollectedPayment?: number;
    totalOverDue?: number;
    totalPending?: number;
  };
};

function PieChartGraph({ billSummary }: Props) {
  // Prepare data for the pie chart
  const data = [
    { name: 'Collected this month', value: billSummary?.totalCollectedPayment || 0 },
    { name: 'Total Pending this month', value: billSummary?.totalPending || 0 },
  ];

  const COLORS = ['#00C49F', '#FFBB28', '#0088FE', '#FF8042'];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}

export default PieChartGraph;
