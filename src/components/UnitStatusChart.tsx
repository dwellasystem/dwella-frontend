import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import type { UnitStatusSummary } from "../hooks/assigned-unit/useUnitStatusSummary";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

type Props = {
  statusSummary?: UnitStatusSummary | null;
};

export default function UnitStatusChart({ statusSummary }: Props) {
  const data = [
    { name: "Owner Occupied", value: statusSummary?.owner_occupied || 0 },
    { name: "Rented", value: statusSummary?.rented_short_term || 0 },
    { name: "Airbnb", value: statusSummary?.air_bnb || 0 },
  ];

  // Custom label formatter to show percentage
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(1)}%`}
      </text>
    );
  };

  // Custom tooltip formatter to show percentage
  const customTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const total = data.reduce((sum, item) => sum + item.value, 0);
      const percentage = total > 0 ? ((payload[0].value / total) * 100).toFixed(1) : 0;

      return (
        <div className="bg-white p-3 border border-gray-300 rounded shadow-sm">
          <p className="font-medium">{`${payload[0].name}`}</p>
          <p className="text-sm text-center">{`${payload[0].value} (${percentage}%)`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={90}
          label={renderCustomizedLabel}
          labelLine={false}
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={customTooltip} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}