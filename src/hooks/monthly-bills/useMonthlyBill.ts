import { useEffect, useState } from "react";
import MonthlyBillService from "../../services/monthlyBill.service";
import type { IServiceError } from "../../interfaces/error-handlers/IServiceError";
import api from "../../api/api";
import { type Paginated } from "../../models/Paginated.model";
import { type MonthlyBill } from "../../models/MonthlyBill.model";
import { API_BASE_URL } from "../../api/endpoint";


export const useMonthlyBill = (filters?: {}) => {
    const [monthlyBill, setMonthlyBill] = useState<Paginated<MonthlyBill>>();
    const [monthlyBillsList, setMonthlyBillsList] = useState<MonthlyBill[]>();
    const [selectedBill, setSelectedBill] = useState<MonthlyBill>();
    const [loading, setLoading] = useState<Boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [pageNumber, setPageNumber] = useState<number>(1);
    
    const {
        getMonthlyBills,
        createMonthlyBill,
        deleteMonthlyBillById,
        updateMonthlyBillById,
        getMonthlyBillById,
    } = MonthlyBillService();

    const fetchMonthlyBillsList = async (filters?: {}) => {
        try {
            const response = await api.get<MonthlyBill[]>(`${API_BASE_URL}/bills/`,{params:filters});
            if (response && response.data) {
                setMonthlyBillsList(response.data);
            }
        } catch (error) {
            const err = error as IServiceError;
            if (err.status !== 200) setError("Server Error");
            console.log(error);
        }
    }

    const fetchMonthlyBill = async (filters?: {}) => {
        try {
          const response = await getMonthlyBills(filters);
          setMonthlyBill(response);
        } catch (error) {
          const err = error as IServiceError;
          if (err.status !== 200) setError("Server Error");
          console.log(error);
        } finally {
          setLoading(false);
        }
    };

      const nextButton = async (url: string) => {
        const response = await api.get(url);
        setMonthlyBill(response.data);
        setPageNumber((prev) => prev + 1);
    };

    const prevButton = async (url: string) => {
        const response = await api.get(url);
        setMonthlyBill(response.data);
        setPageNumber((prev) => prev - 1);
    };

    const createNewMonthlyBill = async (body: {}, headers?:{}) => {
        try {
            await createMonthlyBill(body, headers);
            return await fetchMonthlyBill();
        } catch (error) {
            const err = error as IServiceError;
            if (err.status !== 200) setError("Server Error");
            console.log(error);
        }
    }

    const updateMonthlyBill = async (id: number | string, body: {}) => {
        try {
            await updateMonthlyBillById(id, body);
            return await fetchMonthlyBill();
        } catch (error) {
            const err = error as IServiceError;
            if (err.status !== 200) setError("Server Error");
            console.log(error);
        }
    }

    const deleteMonthlyBill = async (id: number | string) => {
        try {
            await deleteMonthlyBillById(id);
            return await fetchMonthlyBill();
        } catch (error) {
            const err = error as IServiceError;
            if (err.status !== 200) setError("Server Error");
            console.log(error);
        }
    }

    const viewMonthlyBill = async (id: number | string) => {
        try {
            const response = await getMonthlyBillById(id);
            setSelectedBill(response)
            return response;
        } catch (error) {
            const err = error as IServiceError;
            if (err.status !== 200) setError("Server Error");
            console.log(error);
        }
    }

    useEffect(() => {
          fetchMonthlyBill(filters);
          fetchMonthlyBillsList(filters);
    }, [filters]);
    
    return {
        monthlyBill,
        loading,
        error,
        pageNumber,
        selectedBill,
        monthlyBillsList,
        fetchMonthlyBill,
        nextButton,
        prevButton,
        createNewMonthlyBill,
        deleteMonthlyBill,
        updateMonthlyBill,
        viewMonthlyBill,
        fetchMonthlyBillsList,
    };
}