import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function BarGraph({billStats} : any) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        width={500}
        height={400}
        data={billStats}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Area
          type="monotone"
          dataKey="total_paid"
          name="Total Paid"
          stroke="#524ea8ff"
          fill="#8884d8ff"
          fillOpacity={0.4}
        />
        <Area
          type="monotone"
          dataKey="total_pending"
          name="Total Pending"
          stroke="#32a323ff"
          fill="#64db54ff"
          fillOpacity={0.4}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
