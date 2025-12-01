import api from "../api/api";
import { PAYMENT_URLS } from "../api/endpoint"
import type { IServiceError } from "../interfaces/error-handlers/IServiceError";
import type { Paginated } from "../models/Paginated.model";
import type { RecordPayments } from "../models/RecordPayment.model";

export const PaymentService = () => {

    const {CREATE_PAYMENT, GET_PAYMENTS, GET_PAYMENT_BY_ID, DELETE_PAYMENT_BY_ID, UPDATE_PAYMENT_BY_ID, PENDING_PAYMENTS} = PAYMENT_URLS;


    const getPayments = async (filters?:{}) => {
        try {
            const response = await api.get<Paginated<RecordPayments>>(GET_PAYMENTS, {params:filters});
            return response.data;
        } catch (error: any) {
            throw {
                status: error?.response?.status ?? null,
                data: error?.response?.data ?? null,
                message: error?.response?.data?.detail || error?.message || "An unexpected error occurred",
            } as IServiceError;
        }
    }

    const createPayment = async (data: {}, headers?: {}) => {
        try {
            const response = await api.post(CREATE_PAYMENT, data, {headers:headers});
            return response;
        } catch (error: any) {
            throw {
                status: error?.response?.status ?? null,
                data: error?.response?.data ?? null,
                message: error?.response?.data?.detail || error?.message || "An unexpected error occurred",
            } as IServiceError;
        }
    }

    const getPaymentById = async (id: string) => {
        try {
            const response = await api.get(GET_PAYMENT_BY_ID(id));
            return response;
        } catch (error: any) {
            throw {
                status: error?.response?.status ?? null,
                data: error?.response?.data ?? null,
                message: error?.response?.data?.detail || error?.message || "An unexpected error occurred",
            } as IServiceError;
        }
    }

    const updatePaymentById = async (id: string, data: any) => {
        try {
            const response = await api.put(UPDATE_PAYMENT_BY_ID(id), data);
            return response;
        } catch (error: any) {
            throw {
                status: error?.response?.status ?? null,
                data: error?.response?.data ?? null,
                message: error?.response?.data?.detail || error?.message || "An unexpected error occurred",
            } as IServiceError;
        }
    }

    const deletePaymentById = async (id: string) => {
        try {
            const response = await api.delete(DELETE_PAYMENT_BY_ID(id));
            return response;
        } catch (error: any) {
            throw {
                status: error?.response?.status ?? null,
                data: error?.response?.data ?? null,
                message: error?.response?.data?.detail || error?.message || "An unexpected error occurred",
            } as IServiceError;
        }
    }

    const totalPendingPayments = async () => {
        try {
            const response = await api.get(PENDING_PAYMENTS);
            return response;
        } catch (error: any) {
            throw {
                status: error?.response?.status ?? null,
                data: error?.response?.data ?? null,
                message: error?.response?.data?.detail || error?.message || "An unexpected error occurred",
            } as IServiceError;
        }
    }

    return {
        getPayments,
        createPayment,
        getPaymentById,
        updatePaymentById,
        deletePaymentById,
        totalPendingPayments
    };
}