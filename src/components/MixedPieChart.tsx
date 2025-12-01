// components/resident/charts/MixedPieChart.tsx
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const PAYMENT_STATUS_COLORS = ["#00C49F", "#FF8042"]; // Paid, Unpaid
const CHARGE_TYPE_COLORS = ["#0088FE", "#FFBB28", "#FF8042", "#00C49F"]; // Rent, Security, Amenities, Maintenance

interface ChargeDetail {
  amount: number;
  percentage: number;
}

interface AdditionalChargesDetails {
  security: ChargeDetail;
  amenities: ChargeDetail;
  maintenance: ChargeDetail;
}

interface BreakdownPercentages {
  base_rent: ChargeDetail;
  additional_charges: ChargeDetail & {
    details: AdditionalChargesDetails;
  };
}

interface PaymentSummary {
  total_paid: number;
  total_unpaid: number;
  total_amount: number;
  expected_yearly_total: number;
  paid_percentage_of_expected: number;
  unpaid_percentage_of_expected: number;
  completion_rate: number;
}

interface MonthlyBreakdown {
  month: string;
  month_number: number;
  paid: number;
  unpaid: number;
  total: number;
  expected_amount: number;
  percentage_of_expected: number;
  bills_count: number;
}

interface UnitBreakdown {
  unit_id: number;
  unit_name: string;
  building: string;
  total_paid: number;
  total_unpaid: number;
  total_amount: number;
  expected_yearly_amount: number;
  percentage_of_expected: number;
  bills_count: number;
}

interface Props {
  summary: PaymentSummary;
  breakdown: BreakdownPercentages;
  monthlyBreakdown: MonthlyBreakdown[];
  unitBreakdown: UnitBreakdown[]; // Add unit breakdown to props
}

export default function MixedPieChart({ summary, breakdown, monthlyBreakdown }: Props) {
  // Data for MONTHLY payment status (left pie) - Aggregate all months
  const monthlyPaid = monthlyBreakdown.reduce((sum, month) => sum + month.paid, 0);
  const monthlyUnpaid = monthlyBreakdown.reduce((sum, month) => sum + month.unpaid, 0);
  const monthlyTotal = monthlyBreakdown.reduce((sum, month) => sum + month.total, 0);
  const monthlyExpected = monthlyBreakdown.reduce((sum, month) => sum + month.expected_amount, 0);

  const paymentStatusData = [
    { name: "Paid", value: monthlyPaid },
    { name: "Unpaid", value: monthlyUnpaid },
  ];

  // Data for YEARLY charge type breakdown (right pie)
  const chargeTypeData = [
    { 
      name: "Base Rent", 
      value: breakdown.base_rent.amount,
      percentage: breakdown.base_rent.percentage 
    },
    { 
      name: "Security", 
      value: breakdown.additional_charges.details.security.amount,
      percentage: breakdown.additional_charges.details.security.percentage 
    },
    { 
      name: "Amenities", 
      value: breakdown.additional_charges.details.amenities.amount,
      percentage: breakdown.additional_charges.details.amenities.percentage 
    },
    { 
      name: "Maintenance", 
      value: breakdown.additional_charges.details.maintenance.amount,
      percentage: breakdown.additional_charges.details.maintenance.percentage 
    },
  ].filter(item => item.value > 0); // Filter out zero values

  // Calculate billing statistics based on UNIT BREAKDOWN (fixed logic)
  // const totalExpectedBills = unitBreakdown.reduce((sum) => sum + 12, 0); // Each unit should have 12 months
  // const totalActualBills = unitBreakdown.reduce((sum, unit) => sum + unit.bills_count, 0);

  // const totalUnits = unitBreakdown.reduce((accumulator, currentValue) => accumulator + currentValue.bills_count, 0);
  
  // Calculate completion based on units having full 12 months of billing
  // const unitsWithFullBilling = unitBreakdown.filter(unit => unit.bills_count >= 12).length;
  // const billingCompletionRate = totalUnits > 0 ? Math.round((unitsWithFullBilling / totalUnits) * 100) : 0;

  // Calculate monthly completion based on actual payment performance
  const monthsWithExpectedAmount = monthlyBreakdown.filter(month => month.expected_amount > 0);
  // const completedMonths = monthsWithExpectedAmount.filter(month => month.percentage_of_expected >= 100).length;
  const totalMonthsWithBills = monthsWithExpectedAmount.length;
  const monthlyCompletionRate =Math.round(monthlyPaid/monthlyTotal*100)

  // Calculate average expected monthly amount (only for months that should have bills)
  const averageMonthlyExpected = totalMonthsWithBills > 0 
    ? Math.round(monthlyExpected / totalMonthsWithBills)
    : 0;

  // Custom label formatter for payment status
  const renderPaymentLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: any) => {
    if (percent < 0.05) return null; // Don't show label for very small slices
    
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
        fontSize={10}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(1)}%`}
      </text>
    );
  };

  // Custom label formatter for charge types
  const renderChargeTypeLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: any) => {
    if (percent < 0.05) return null; // Don't show label for small slices
    
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
        fontSize={9}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  // Custom tooltip for payment status
  const PaymentTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const total = paymentStatusData.reduce((sum, item) => sum + item.value, 0);
      const percentage = total > 0 ? ((payload[0].value / total) * 100).toFixed(1) : 0;

      return (
        <div className="bg-white p-3 border border-gray-300 rounded shadow-sm">
          <p className="font-medium">{`${payload[0].name}`}</p>
          <p className="text-sm">{`₱${payload[0].value.toLocaleString()} (${percentage}%)`}</p>
        </div>
      );
    }
    return null;
  };

  // Custom tooltip for charge types
  const ChargeTypeTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-300 rounded shadow-sm">
          <p className="font-medium">{`${data.name}`}</p>
          <p className="text-sm">{`Amount: ₱${data.value.toLocaleString()}`}</p>
          <p className="text-sm">{`Percentage: ${data.percentage}%`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-4 rounded-3 shadow-sm">
      <h5 className="mb-4 fw-bold text-center">Payment Analysis</h5>
      
      <div className="row">
        {/* MONTHLY Payment Status Pie Chart (LEFT) */}
        <div className="col-md-6">
          <h6 className="text-center mb-3 fw-bold">Monthly Payment Summary</h6>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={paymentStatusData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={renderPaymentLabel}
                labelLine={false}
              >
                {paymentStatusData.map((_, index) => (
                  <Cell key={`payment-cell-${index}`} fill={PAYMENT_STATUS_COLORS[index % PAYMENT_STATUS_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<PaymentTooltip />} />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                formatter={(value) => <span style={{ fontSize: '12px' }}>{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
          
          {/* Monthly Summary */}
          <div className="text-center mt-2">
            <div className="d-flex justify-content-center gap-4">
              <div>
                <div className="fw-bold text-success">₱{monthlyPaid.toLocaleString()}</div>
                <small className="text-muted">Monthly Paid</small>
              </div>
              <div>
                <div className="fw-bold text-warning">₱{monthlyUnpaid.toLocaleString()}</div>
                <small className="text-muted">Monthly Unpaid</small>
              </div>
            </div>
            <div className="mt-2">
              <small className="text-muted">
                Monthly Completion: <strong>{monthlyCompletionRate}%</strong> {/**({totalUnits/2}/{totalMonthsWithBills} months) **/}
              </small>
            </div>
            <div className="mt-1">
              <small className="text-muted">
                Average Monthly Expected: <strong>₱{averageMonthlyExpected.toLocaleString()}</strong>
              </small>
            </div>
          </div>
        </div>

        {/* YEARLY Charge Type Breakdown Pie Chart (RIGHT) */}
        <div className="col-md-6">
          <h6 className="text-center mb-3 fw-bold">Yearly Charge Breakdown</h6>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={chargeTypeData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={renderChargeTypeLabel}
                labelLine={false}
              >
                {chargeTypeData.map((_,index) => (
                  <Cell key={`charge-cell-${index}`} fill={CHARGE_TYPE_COLORS[index % CHARGE_TYPE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<ChargeTypeTooltip />} />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                formatter={(value) => <span style={{ fontSize: '12px' }}>{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
          
          {/* Yearly Summary */}
          <div className="text-center mt-2">
            <div className="d-flex justify-content-center gap-3 flex-wrap">
              <div>
                <div className="fw-bold text-primary">₱{breakdown.base_rent.amount.toLocaleString()}</div>
                <small className="text-muted">Base Rent</small>
              </div>
              <div>
                <div className="fw-bold" style={{ color: '#FFBB28' }}>
                  ₱{breakdown.additional_charges.amount.toLocaleString()}
                </div>
                <small className="text-muted">Additional</small>
              </div>
            </div>
            <div className="mt-2">
              <small className="text-muted">
                Expected Yearly Total: <strong>₱{summary.expected_yearly_total.toLocaleString()}</strong>
              </small>
            </div>
            <div className="mt-1">
              <small className="text-muted">
                Yearly Completion: <strong>{summary.completion_rate}%</strong>
              </small>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Charges Details */}
      <div className="mt-4 p-3 bg-light rounded">
        <h6 className="fw-bold mb-2">Additional Charges Breakdown</h6>
        <div className="row text-center">
          <div className="col-4">
            <div className="fw-bold" style={{ color: '#FFBB28' }}>
              ₱{breakdown.additional_charges.details.security.amount.toLocaleString()}
            </div>
            <small className="text-muted">
              Security ({breakdown.additional_charges.details.security.percentage}%)
            </small>
          </div>
          <div className="col-4">
            <div className="fw-bold" style={{ color: '#FF8042' }}>
              ₱{breakdown.additional_charges.details.amenities.amount.toLocaleString()}
            </div>
            <small className="text-muted">
              Amenities ({breakdown.additional_charges.details.amenities.percentage}%)
            </small>
          </div>
          <div className="col-4">
            <div className="fw-bold" style={{ color: '#00C49F' }}>
              ₱{breakdown.additional_charges.details.maintenance.amount.toLocaleString()}
            </div>
            <small className="text-muted">
              Maintenance ({breakdown.additional_charges.details.maintenance.percentage}%)
            </small>
          </div>
        </div>
      </div>

      {/* Unit Billing Overview */}
      {/* <div className="mt-3 p-3 bg-light rounded">
        <h6 className="fw-bold mb-2">Unit Billing Overview</h6>
        <div className="row text-center">
          <div className="col-3">
            <div className="fw-bold text-primary">{unitsWithFullBilling}</div>
            <small className="text-muted">Units with Full Billing</small>
          </div>
          <div className="col-3">
            <div className="fw-bold text-warning">{totalUnits - unitsWithFullBilling}</div>
            <small className="text-muted">Units with Partial Billing</small>
          </div>
          <div className="col-3">
            <div className="fw-bold text-info">{totalActualBills}</div>
            <small className="text-muted">Total Bills Generated</small>
          </div>
          <div className="col-3">
            <div className="fw-bold text-success">{billingCompletionRate}%</div>
            <small className="text-muted">Billing Completion</small>
          </div>
        </div> */}
        {/* <div className="mt-2 text-center">
          <small className="text-muted">
            Expected: {totalExpectedBills} bills ({totalUnits} units × 12 months) | 
            Actual: {totalActualBills} bills generated
          </small>
        </div> */}
        
        {/* Unit-wise breakdown */}
        {/* <div className="mt-3">
          <h6 className="fw-bold mb-2">Unit Details</h6>
          {unitBreakdown.map((unit) => (
            <div key={unit.unit_id} className="d-flex justify-content-between align-items-center mb-2">
              <div>
                <strong>{unit.unit_name}</strong> ({unit.building})
              </div>
              <div>
                <span className={unit.bills_count >= 12 ? "text-success" : "text-warning"}>
                  {unit.bills_count}/12 bills
                </span>
                {unit.bills_count < 12 && (
                  <small className="text-muted ms-2">({12 - unit.bills_count} unpaid)</small>
                )}
              </div>
            </div>
          ))}
        </div>
      </div> */}
    </div>
  );
}