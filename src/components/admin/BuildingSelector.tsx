// components/admin/expense-reflection/BuildingSelector.tsx
import React from 'react';
import { Card, Form, Col, Row } from 'react-bootstrap';
import { Building, Calendar, Filter } from 'lucide-react';

interface BuildingSelectorProps {
  buildings: string[];
  selectedBuilding: string | null;
  setSelectedBuilding: (building: string | null) => void;
  selectedYear: string | null;
  setSelectedYear: (year: string | null) => void;
  selectedMonth: string | null;
  setSelectedMonth: (month: string | null) => void;
}

interface MonthOption {
  value: string;
  label: string;
}

const BuildingSelector: React.FC<BuildingSelectorProps> = ({ 
  buildings, 
  selectedBuilding, 
  setSelectedBuilding,
  selectedYear,
  setSelectedYear,
  selectedMonth,
  setSelectedMonth 
}) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
  
  const months: MonthOption[] = [
    { value: '', label: 'All Months' },
    { value: '1', label: 'January' },
    { value: '2', label: 'February' },
    { value: '3', label: 'March' },
    { value: '4', label: 'April' },
    { value: '5', label: 'May' },
    { value: '6', label: 'June' },
    { value: '7', label: 'July' },
    { value: '8', label: 'August' },
    { value: '9', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ];

  const selectedMonthLabel = months.find(m => m.value === selectedMonth)?.label;

  return (
    <Card className="border-0 shadow-sm mb-4">
      <Card.Body>
        <div className="d-flex align-items-center mb-3">
          <Filter size={20} className="me-2 text-primary" />
          <h6 className="fw-bold mb-0">Filter Expenses</h6>
        </div>
        
        <Row className="g-3">
          <Col md={4}>
            <div className="d-flex align-items-center mb-2">
              <Building size={16} className="me-2 text-muted" />
              <small className="text-muted">Building</small>
            </div>
            <Form.Select
              value={selectedBuilding || ''}
              onChange={(e) => setSelectedBuilding(e.target.value || null)}
              className="border-0 shadow-sm"
            >
              <option value="">All Buildings</option>
              {buildings.map((building) => (
                <option key={building} value={building}>
                  {building}
                </option>
              ))}
            </Form.Select>
          </Col>
          
          <Col md={4}>
            <div className="d-flex align-items-center mb-2">
              <Calendar size={16} className="me-2 text-muted" />
              <small className="text-muted">Year</small>
            </div>
            <Form.Select
              value={selectedYear || ''}
              onChange={(e) => setSelectedYear(e.target.value || null)}
              className="border-0 shadow-sm"
            >
              <option value="">All Years</option>
              {years.map((year) => (
                <option key={year} value={year.toString()}>
                  {year}
                </option>
              ))}
            </Form.Select>
          </Col>
          
          <Col md={4}>
            <div className="d-flex align-items-center mb-2">
              <Calendar size={16} className="me-2 text-muted" />
              <small className="text-muted">Month</small>
            </div>
            <Form.Select
              value={selectedMonth || ''}
              onChange={(e) => setSelectedMonth(e.target.value || null)}
              className="border-0 shadow-sm"
              disabled={!selectedYear}
            >
              {months.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </Form.Select>
          </Col>
        </Row>
        
        {selectedYear && selectedMonth && selectedMonthLabel && (
          <div className="mt-3 text-center">
            <small className="text-muted">
              Showing: {selectedMonthLabel} {selectedYear}
            </small>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default BuildingSelector;