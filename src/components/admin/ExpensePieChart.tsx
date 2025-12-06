// components/admin/expense-reflection/ExpensePieChart.tsx
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, type PieProps, } from 'recharts';
import { Card } from 'react-bootstrap';
import type { ExpenseData } from '../../models/expense-reflection.model';

interface ExpensePieChartProps {
  expenseData: ExpenseData | null;
}

// Use a type that extends Recharts' expected type
interface PieDataItem {
  name: string;
  value: number;
  color: string;
}

const ExpensePieChart: React.FC<ExpensePieChartProps> = ({ expenseData }) => {
  if (!expenseData) return null;

  const data: PieDataItem[] = [
    { 
      name: 'Maintenance', 
      value: typeof expenseData.maintenance === 'string' ? parseFloat(expenseData.maintenance) : expenseData.maintenance, 
      color: '#FF6384' 
    },
    { 
      name: 'Security', 
      value: typeof expenseData.security === 'string' ? parseFloat(expenseData.security) : expenseData.security, 
      color: '#36A2EB' 
    },
    { 
      name: 'Amenities', 
      value: typeof expenseData.amenities === 'string' ? parseFloat(expenseData.amenities) : expenseData.amenities, 
      color: '#FFCE56' 
    },
  ];

  const RADIAN = Math.PI / 180;
  
  const renderCustomizedLabel: PieProps['label'] = ({ 
    cx, 
    cy, 
    midAngle, 
    innerRadius, 
    outerRadius, 
    percent 
  }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
    }).format(value);
  };

  interface CustomTooltipProps {
    active?: boolean;
    payload?: Array<{
      name: string;
      value: number;
      payload: PieDataItem;
    }>;
  }

  const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const totalExpense = typeof expenseData.totalExpense === 'string' 
        ? parseFloat(expenseData.totalExpense) 
        : expenseData.totalExpense;
      
      return (
        <div className="custom-tooltip bg-white p-3 shadow-sm rounded border">
          <p className="fw-bold mb-1">{payload[0].name}</p>
          <p className="mb-0 text-muted">{formatCurrency(payload[0].value)}</p>
          <p className="mb-0 small text-muted">
            {((payload[0].value / totalExpense) * 100).toFixed(1)}% of total
          </p>
        </div>
      );
    }
    return null;
  };

  // Alternative approach - Use simpler type that works with Recharts
  const chartData = data.map(item => ({
    name: item.name,
    value: item.value,
  }));

  return (
    <Card className="border-0 shadow-sm h-100">
      <Card.Body>
        <h5 className="fw-bold mb-3">💰 Expense Distribution</h5>
        <div style={{ height: '300px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}  // Use the simpler data structure
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                layout="vertical"
                verticalAlign="middle"
                align="right"
                wrapperStyle={{
                  paddingLeft: '20px',
                }}
                formatter={(value: string) => (
                  <span style={{ color: '#666', fontSize: '12px' }}>
                    {value}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-3 text-center">
          <small className="text-muted">
            Total: {formatCurrency(
              typeof expenseData.totalExpense === 'string' 
                ? parseFloat(expenseData.totalExpense) 
                : expenseData.totalExpense
            )}
          </small>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ExpensePieChart;