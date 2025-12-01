import api from "../api/api";
import { MONTHLY_BILLING_URLS } from "../api/endpoint";
import type { IServiceError } from "../interfaces/error-handlers/IServiceError";
import type { MonthlyBill } from "../models/MonthlyBill.model";
import type { Paginated } from "../models/Paginated.model";

const MonthlyBillService = () => {
    const {CREATE_BILL, GET_BILL, GET_BILL_BY_ID, UPDATE_BILL_BY_ID, DELETE_BILL_BY_ID} = MONTHLY_BILLING_URLS;
    
    
    const getMonthlyBills = async (params?: {}) => {
        try {
            const response = await api.get<Paginated<MonthlyBill>>(GET_BILL, {params: params});
            return response.data;
        } catch (error: any) {
            throw {
                status: error?.response?.status ?? null,
                data: error?.response?.data ?? null,
                message: error?.response?.data?.detail || error?.message || "An unexpected error occurred",
            } as IServiceError;
        }
    }

    const createMonthlyBill = async (body: {}, headers?: {}) => {
        try {
            const response = await api.post<MonthlyBill>(CREATE_BILL, body, {headers: headers});
            return response.data;
        } catch (error: any) {
            throw {
                status: error?.response?.status ?? null,
                data: error?.response?.data ?? null,
                message: error?.response?.data?.detail || error?.message || "An unexpected error occurred",
            } as IServiceError;
        }
    }
    
    const getMonthlyBillById = async (id: number | string) => { 
        try {
            const response = await api.get<MonthlyBill>(GET_BILL_BY_ID(id));
            return response.data;
        } catch (error: any) {
            throw {
                status: error?.response?.status ?? null,
                data: error?.response?.data ?? null,
                message: error?.response?.data?.detail || error?.message || "An unexpected error occurred",
            } as IServiceError;
        }
    }

    const updateMonthlyBillById = async (id: number | string, body: {}) => {
        try {
            const response = await api.put<MonthlyBill>(UPDATE_BILL_BY_ID(id), body);
            return response.data;
        } catch (error: any) {
            throw {
                status: error?.response?.status ?? null,
                data: error?.response?.data ?? null,
                message: error?.response?.data?.detail || error?.message || "An unexpected error occurred",
            } as IServiceError;
        }
    }

    const deleteMonthlyBillById = async (id: number | string) => {
        try {
            const response = await api.delete(DELETE_BILL_BY_ID(id));
            return response.data;
        } catch (error: any) {
            throw {
                status: error?.response?.status ?? null,
                data: error?.response?.data ?? null,
                message: error?.response?.data?.detail || error?.message || "An unexpected error occurred",
            } as IServiceError;
        }
    }

    return {
        getMonthlyBills,
        createMonthlyBill,
        getMonthlyBillById,
        updateMonthlyBillById,
        deleteMonthlyBillById
    }

};

export default MonthlyBillService;