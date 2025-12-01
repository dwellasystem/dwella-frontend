import { useEffect, useState } from 'react'
import type { Paginated } from '../../models/Paginated.model';
import MonthlyBillService from '../../services/monthlyBill.service';
import type { MonthlyBill } from '../../models/MonthlyBill.model';
import api from '../../api/api';

function usePaginatedBilling(filters?:{}) {
    const [paginatedBill, setPaginatedBill] = useState<Paginated<MonthlyBill> | null>(null);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [pageNumber, setPageNumber] = useState<number>(1);

    const {getMonthlyBills} = MonthlyBillService();

    const fetchPaginatedBill = async () => {
        setLoading(true);
        try {
            const response = await getMonthlyBills(filters);
            setPaginatedBill(response);
        } catch (error) {
            setError(true);
        }finally{
           setLoading(false);
        }
    }

    const nextButton = async (url: string) => {
        const response = await api.get(url);
        setPaginatedBill(response.data);
        setPageNumber((prev) => prev + 1);
    };


    const prevButton = async (url: string) => {
        const response = await api.get(url);
        setPaginatedBill(response.data);
        setPageNumber((prev) => prev - 1);
    };

    useEffect(() => {
        fetchPaginatedBill();
    }, [filters]);

    return {
        paginatedBill,
        nextButton,
        prevButton,
        pageNumber,
        error,
        loading
  }
}

export default usePaginatedBilling