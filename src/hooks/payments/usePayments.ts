import { useEffect, useState } from "react";
import { PaymentService } from "../../services/payment.service";
import type { RecordPayments } from "../../models/RecordPayment.model";
import type { Paginated } from "../../models/Paginated.model";
import api from "../../api/api";
import { API_BASE_URL } from "../../api/endpoint";
import axios from "axios";

export const usePayments = (filters?:{}) => {
  const {
    createPayment,
    getPayments,
    updatePaymentById,
    deletePaymentById,
  } = PaymentService();

  const [payments, setPayments] = useState<Paginated<RecordPayments>>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);

  const fetchPayments = async (filters?:{}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getPayments(filters);
      setPayments(response);
    } catch (err: any) {
      setError(err.message || "Failed to fetch payments");
    } finally {
      setLoading(false);
    }
  };

  const nextButton = async (url: string) => {
    const response = await api.get(url);
    setPayments(response.data);
    setPageNumber((prev) => prev + 1);
  };

  const prevButton = async (url: string) => {
    const response = await api.get(url);
    setPayments(response.data);
    setPageNumber((prev) => prev - 1);
  };

  const createPaymentRecord = async (body: {}, headers?: {}) => {
    await createPayment(body, headers);
    fetchPayments(filters);
    // return response;
  }

  const deletePayment = async (id: string) => {
    await deletePaymentById(id);
    fetchPayments(filters);
  }

  const updatePayment = async (id: string, body: {}) => {
    await updatePaymentById(id, body)
    fetchPayments(filters);
  }

  const calculateAdvance = async (payment:{startDate: string, endDate: string, user:number, unit: number}) => {
    const res = await axios.post(`${API_BASE_URL}/calculate-advance/`, {
        user: payment.user,
        unit: payment.unit,
        start_date: payment.startDate,
        end_date: payment.endDate
    });
    const data = res.data;

    return data
    
    // Show preview to user:
    // "You are paying for 3 months (Mar-May 2024)"
    // "Monthly: ₱5,000.00"
    // "Total: ₱15,000.00"
};

  useEffect(() => {
    fetchPayments(filters);
  }, [filters]);

  return {
    payments,
    loading,
    error,
    prevButton,
    nextButton,
    deletePayment,
    updatePayment,
    createPaymentRecord,
    calculateAdvance,
    pageNumber
  };
};
