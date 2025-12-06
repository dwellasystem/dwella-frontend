// components/admin/expense-reflection/MonthlyTrendChart.tsx
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card } from 'react-bootstrap';
import type { MonthlyData } from '../../models/expense-reflection.model';


interface MonthlyTrendChartProps {
  monthlyData: MonthlyData | null;
}

interface ChartDataItem {
  name: string;
  maintenance: number;
  security: number;
  amenities: number;
  total: number;
}

const MonthlyTrendChart: React.FC<MonthlyTrendChartProps> = ({ monthlyData }) => {
  if (!monthlyData?.monthly_data) return null;

  const data: ChartDataItem[] = monthlyData.monthly_data.map(month => ({
    name: month.month_name.substring(0, 3),
    maintenance: month.maintenance,
    security: month.security,
    amenities: month.amenities,
    total: month.totalExpense,
  }));

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(value);
  };

  interface CustomTooltipProps {
    active?: boolean;
    payload?: Array<{
      name: string;
      value: number;
      color: string;
    }>;
    label?: string;
  }

  const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip bg-white p-3 shadow-sm rounded border">
          <p className="fw-bold mb-2">Month: {label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="mb-1" style={{ color: entry.color }}>
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="border-0 shadow-sm h-100">
      <Card.Body>
        <h5 className="fw-bold mb-3">📅 Monthly Expense Trend ({monthlyData.year})</h5>
        <div style={{ height: '300px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="name" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#666' }}
              />
              <YAxis 
                tickFormatter={formatCurrency}
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#666' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="maintenance"
                name="Maintenance"
                stroke="#FF6384"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="security"
                name="Security"
                stroke="#36A2EB"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="amenities"
                name="Amenities"
                stroke="#FFCE56"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-3 text-center">
          <small className="text-muted">
            Yearly Total: {formatCurrency(monthlyData.yearly_summary?.totalExpense || 0)}
          </small>
        </div>
      </Card.Body>
    </Card>
  );
};

export default MonthlyTrendChart;