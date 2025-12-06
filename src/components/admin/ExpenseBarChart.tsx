// components/admin/expense-reflection/ExpenseBarChart.tsx
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card } from 'react-bootstrap';
import type { YearlyData } from '../../models/expense-reflection.model';


interface ExpenseBarChartProps {
  yearlyData: YearlyData | null;
}

interface BarDataItem {
  year: string;
  maintenance: number;
  security: number;
  amenities: number;
}

const ExpenseBarChart: React.FC<ExpenseBarChartProps> = ({ yearlyData }) => {
  if (!yearlyData?.yearly_data) return null;

  const data: BarDataItem[] = yearlyData.yearly_data.map(year => ({
    year: year.year.toString(),
    maintenance: year.maintenance,
    security: year.security,
    amenities: year.amenities,
  })).reverse(); // Show most recent first

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
          <p className="fw-bold mb-2">Year: {label}</p>
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
        <h5 className="fw-bold mb-3">📈 Yearly Expense Trends</h5>
        <div style={{ height: '300px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
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
                dataKey="year" 
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
              <Legend 
                wrapperStyle={{
                  paddingTop: '10px',
                }}
              />
              <Bar dataKey="maintenance" name="Maintenance" fill="#FF6384" radius={[4, 4, 0, 0]} />
              <Bar dataKey="security" name="Security" fill="#36A2EB" radius={[4, 4, 0, 0]} />
              <Bar dataKey="amenities" name="Amenities" fill="#FFCE56" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-3 text-center">
          <small className="text-muted">
            Building: {yearlyData.building_filter || 'All Buildings'}
          </small>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ExpenseBarChart;