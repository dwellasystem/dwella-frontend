// components/admin/expense-reflection/ExpenseCards.tsx
import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { TrendingUp, DollarSign, PieChart, Shield, Home } from 'lucide-react';
import type { ExpenseData } from '../../models/expense-reflection.model';


interface ExpenseCardsProps {
  expenseData: ExpenseData | null;
  buildingFilter: string;
}

interface CardItem {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  description: string;
}

const ExpenseCards: React.FC<ExpenseCardsProps> = ({ expenseData, buildingFilter }) => {
  if (!expenseData) return null;

  const formatCurrency = (amount: string | number): string => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2,
    }).format(numAmount);
  };

  const getPercentageChange = (current: number, previous: number): string => {
    if (!previous || previous === 0) return '0.0';
    return ((current - previous) / previous * 100).toFixed(1);
  };

  const cardData: CardItem[] = [
    {
      title: 'Maintenance',
      value: typeof expenseData.maintenance === 'string' ? parseFloat(expenseData.maintenance) : expenseData.maintenance,
      icon: <Home size={24} />,
      color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      description: 'Building upkeep & repairs',
    },
    {
      title: 'Security',
      value: typeof expenseData.security === 'string' ? parseFloat(expenseData.security) : expenseData.security,
      icon: <Shield size={24} />,
      color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      description: 'Security personnel & systems',
    },
    {
      title: 'Amenities',
      value: typeof expenseData.amenities === 'string' ? parseFloat(expenseData.amenities) : expenseData.amenities,
      icon: <PieChart size={24} />,
      color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      description: 'Facilities & common areas',
    },
    {
      title: 'Total Expenses',
      value: typeof expenseData.totalExpense === 'string' ? parseFloat(expenseData.totalExpense) : expenseData.totalExpense,
      icon: <DollarSign size={24} />,
      color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      description: 'Sum of all categories',
    },
  ];

  return (
    <Row className="g-3">
      {cardData.map((card, index) => (
        <Col md={3} key={index}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h6 className="text-muted mb-1">{card.title}</h6>
                  <h3 className="fw-bold mb-0">{formatCurrency(card.value)}</h3>
                </div>
                <div 
                  className="p-2 rounded"
                  style={{
                    background: card.color,
                    color: 'white',
                  }}
                >
                  {card.icon}
                </div>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <small className="text-muted">{card.description}</small>
                {card.title === 'Total Expenses' && (
                  <small className="text-success">
                    <TrendingUp size={14} className="me-1" />
                    {getPercentageChange(card.value, card.value * 0.9)}%
                  </small>
                )}
              </div>
            </Card.Body>
            <Card.Footer className="bg-transparent border-0 pt-0">
              <small className="text-muted">
                Building: <span className="fw-semibold">{buildingFilter || 'All'}</span>
              </small>
            </Card.Footer>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default ExpenseCards;