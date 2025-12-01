import axios from "axios";
import { useEffect, useState } from "react"
import { API_BASE_URL } from "../../api/endpoint";

interface MonthlyBreakdownItem {
  month: string;
  month_number: number;
  paid: number;
  unpaid: number;
  total: number;
  expected_amount: number;
  percentage_of_expected: number;
  bills_count: number;
}

interface UnitBreakdownItem {
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

export interface UserYearlyPaymentBreakdownResponse {
  year: number;
  user_id: number;
  summary: PaymentSummary;
  breakdown_percentages: BreakdownPercentages;
  monthly_breakdown: MonthlyBreakdownItem[];
  unit_breakdown: UnitBreakdownItem[];
}

function useUsersYearlySummary(id: number | undefined) {
  const [summary, setSummary] = useState<UserYearlyPaymentBreakdownResponse>();

  const fetchBillSummary = async () => {
    const response = await axios.get<UserYearlyPaymentBreakdownResponse>(`${API_BASE_URL}/bills/yearly-summary/${id}/`);
    setSummary(response.data)
  }
  
  useEffect(() => {
    fetchBillSummary();
  }, [id])

  return {
    summary
  }
}

export default useUsersYearlySummary