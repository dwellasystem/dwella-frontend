// hooks/expense-reflection/useExpenseReflection.ts
import { useState, useEffect, useCallback } from 'react';


import api from '../../api/api';
import type { ExpenseData, MonthlyData, YearlyData } from '../../models/expense-reflection.model';
import { API_BASE_URL } from '../../api/endpoint';

interface UseExpenseReflectionReturn {
  expenseData: ExpenseData | null;
  yearlyData: YearlyData | null;
  monthlyData: MonthlyData | null;
  loading: boolean;
  error: string | null;
  refreshData: () => void;
  fetchMonthlyData: (year: number) => void;
}

const useExpenseReflection = (
  building: string | null = null, 
  year: string | null = null, 
  month: string | null = null
): UseExpenseReflectionReturn => {
  const [expenseData, setExpenseData] = useState<ExpenseData | null>(null);
  const [yearlyData, setYearlyData] = useState<YearlyData | null>(null);
  const [monthlyData, setMonthlyData] = useState<MonthlyData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExpenseReflection = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params: Record<string, string> = {};
      if (building) params.building = building;
      if (year) params.year = year;
      if (month) params.month = month;
      
      const response = await api.get<ExpenseData>(`${API_BASE_URL}/bills/expense-reflection/`, { params });
      setExpenseData(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch expense data');
      console.error('Error fetching expense reflection:', err);
    } finally {
      setLoading(false);
    }
  }, [building, year, month]);

  const fetchYearlyData = useCallback(async () => {
    try {
      const params: Record<string, string> = {};
      if (building) params.building = building;
      
      const response = await api.get<YearlyData>(`${API_BASE_URL}/bills/expense-reflection/yearly/`, { params });
      setYearlyData(response.data);
    } catch (err) {
      console.error('Error fetching yearly expense data:', err);
    }
  }, [building]);

  const fetchMonthlyData = useCallback(async (selectedYear: number) => {
    try {
      const params: Record<string, string> = {};
      if (building) params.building = building;
      
      const response = await api.get<MonthlyData>(`/bills/expense-reflection/monthly/${selectedYear}/`, { params });
      setMonthlyData(response.data);
    } catch (err) {
      console.error('Error fetching monthly expense data:', err);
    }
  }, [building]);

  useEffect(() => {
    fetchExpenseReflection();
    fetchYearlyData();
    
    // Fetch current year's monthly data by default
    const currentYear = new Date().getFullYear();
    fetchMonthlyData(currentYear);
  }, [fetchExpenseReflection, fetchYearlyData, fetchMonthlyData]);

  const refreshData = (): void => {
    fetchExpenseReflection();
    fetchYearlyData();
    if (year) {
      fetchMonthlyData(parseInt(year));
    }
  };

  return {
    expenseData,
    yearlyData,
    monthlyData,
    loading,
    error,
    refreshData,
    fetchMonthlyData,
  };
};

export default useExpenseReflection;