// components/resident/PaymentBreakdownChart.tsx
import React from 'react';
import type { UserYearlyPaymentBreakdownResponse } from '../hooks/monthly-bills/useUsersYearlySummary';

interface Props {
  data: UserYearlyPaymentBreakdownResponse;
}

const PaymentBreakdownChart: React.FC<Props> = ({ data }) => {
  const { summary, breakdown_percentages } = data;

  return (
    <div className="bg-white p-4 rounded-3 shadow-sm">
      <h5 className="mb-4 fw-bold">Payment Breakdown</h5>
      
      {/* Summary Cards */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card border-0 bg-light">
            <div className="card-body text-center">
              <h6 className="card-title text-muted">Completion Rate</h6>
              <h3 className="text-primary">{summary.completion_rate}%</h3>
              <small className="text-muted">
                ₱{summary.total_paid.toLocaleString()} of ₱{summary.expected_yearly_total.toLocaleString()}
              </small>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 bg-light">
            <div className="card-body text-center">
              <h6 className="card-title text-muted">Base Rent</h6>
              <h3 className="text-success">{breakdown_percentages.base_rent.percentage}%</h3>
              <small className="text-muted">
                ₱{breakdown_percentages.base_rent.amount.toLocaleString()}
              </small>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 bg-light">
            <div className="card-body text-center">
              <h6 className="card-title text-muted">Additional Charges</h6>
              <h3 className="text-warning">{breakdown_percentages.additional_charges.percentage}%</h3>
              <small className="text-muted">
                ₱{breakdown_percentages.additional_charges.amount.toLocaleString()}
              </small>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Charges Breakdown */}
      <div className="mb-4">
        <h6 className="fw-bold mb-3">Additional Charges Details</h6>
        <div className="row">
          <div className="col-md-4">
            <div className="d-flex justify-content-between border-bottom pb-2">
              <span>Security:</span>
              <span>
                {breakdown_percentages.additional_charges.details.security.percentage}% 
                (₱{breakdown_percentages.additional_charges.details.security.amount.toLocaleString()})
              </span>
            </div>
          </div>
          <div className="col-md-4">
            <div className="d-flex justify-content-between border-bottom pb-2">
              <span>Amenities:</span>
              <span>
                {breakdown_percentages.additional_charges.details.amenities.percentage}% 
                (₱{breakdown_percentages.additional_charges.details.amenities.amount.toLocaleString()})
              </span>
            </div>
          </div>
          <div className="col-md-4">
            <div className="d-flex justify-content-between border-bottom pb-2">
              <span>Maintenance:</span>
              <span>
                {breakdown_percentages.additional_charges.details.maintenance.percentage}% 
                (₱{breakdown_percentages.additional_charges.details.maintenance.amount.toLocaleString()})
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Unit Breakdown */}
      {data.unit_breakdown.length > 0 && (
        <div>
          <h6 className="fw-bold mb-3">Unit Breakdown</h6>
          {data.unit_breakdown.map((unit: any) => (
            <div key={unit.unit_id} className="card mb-2">
              <div className="card-body py-2">
                <div className="d-flex justify-content-between align-items-center">
                  <span className="fw-bold">{unit.unit_name} ({unit.building})</span>
                  <span className={unit.percentage_of_expected >= 75 ? 'text-success' : 'text-warning'}>
                    {unit.percentage_of_expected}% Complete
                  </span>
                </div>
                <small className="text-muted">
                  ₱{unit.total_paid.toLocaleString()} paid of ₱{unit.expected_yearly_amount.toLocaleString()}
                </small>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PaymentBreakdownChart;