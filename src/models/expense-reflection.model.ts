// types/expense-reflection.ts
export interface ExpenseData {
  maintenance: string | number;
  security: string | number;
  amenities: string | number;
  totalExpense: string | number;
  totalPaid: string | number;
  totalUnpaid: string | number;
  building_filter: string | null;
  other_expenses?: string | number;
  total_all_bills?: string | number;
  summary?: {
    categorized_total: number;
    other_expenses: number;
    total_all_bills: number;
    categorized_percentage: number;
    other_percentage: number;
    verification: string;
  };
  chart_data?: {
    type: string;
    data: {
      labels: string[];
      datasets: Array<{
        data: number[];
        backgroundColor: string[];
        hoverBackgroundColor?: string[];
      }>;
    };
    total?: number;
  };
  calculation_note?: string;
  filters_applied?: {
    building: string | null;
    year: string | null;
    month: string | null;
    start_date: string | null;
    end_date: string | null;
    chart_type: string;
  };
}

export interface YearlyExpenseItem {
  year: number;
  maintenance: number;
  security: number;
  amenities: number;
  other_expenses: number;
  totalExpense: number;
  total_all_bills: number;
  total_paid: number;
  total_unpaid: number;
  payment_rate: number;
}

export interface YearlyData {
  yearly_data: YearlyExpenseItem[];
  building_filter: string;
  total_years: number;
}

export interface MonthlyExpenseItem {
  month_number: number;
  month_name: string;
  maintenance: number;
  security: number;
  amenities: number;
  other_expenses: number;
  totalExpense: number;
  total_all_bills: number;
  total_paid: number;
  total_unpaid: number;
  bill_count: number;
  payment_rate: number;
}

export interface MonthlyData {
  year: number;
  monthly_data: MonthlyExpenseItem[];
  yearly_summary: {
    maintenance: number;
    security: number;
    amenities: number;
    other_expenses: number;
    totalExpense: number;
    total_all_bills: number;
    total_paid: number;
    total_unpaid: number;
    payment_rate: number;
  };
  building_filter: string;
  total_months: number;
}