import api from "../api/api";
import { PAYMENT_METHODS_URLS } from "../api/endpoint";
import type { IServiceError } from "../interfaces/error-handlers/IServiceError";

const PaymentMethodService = () => {
    const {
        CREATE_PAYMENT_METHOD, 
        GET_PAYMENT_METHODS, 
        GET_PAYMENT_METHOD_BY_ID, 
        DELETE_PAYMENT_METHOD_BY_ID, 
        UPDATE_PAYMENT_METHOD_BY_ID} = PAYMENT_METHODS_URLS;

    const getPaymentMethods = async () => {
       try {
            const response = await api.get(GET_PAYMENT_METHODS);
            return response;
       } 
       catch (error: any) {
             throw {
                    status: error?.response?.status ?? null,
                    data: error?.response?.data ?? null,
                    message: error?.response?.data?.detail  || error?.message || "An unexpected error occurred",
            } as IServiceError;
       }
    }

    const createPaymentMethod = async (data: any) => {
        try {
            const response = await api.post(CREATE_PAYMENT_METHOD, data);
            return response;
        } catch (error: any) {
            throw {
                status: error?.response?.status ?? null,
                data: error?.response?.data ?? null,
                message: error?.response?.data?.detail || error?.message || "An unexpected error occurred",
            } as IServiceError;
        }
    }

    const getPaymentMethodById = async (id: string) => {
        try {
            const response = await api.get(GET_PAYMENT_METHOD_BY_ID(id));
            return response;
        } catch (error: any) {
            throw {
                status: error?.response?.status ?? null,
                data: error?.response?.data ?? null,
                message: error?.response?.data?.detail || error?.message || "An unexpected error occurred",
            } as IServiceError;
        }
    }

    const updatePaymentMethodById = async (id: string, data: any) => {
        try {
            const response = await api.put(UPDATE_PAYMENT_METHOD_BY_ID(id), data);
            return response;
        } catch (error: any) {
            throw {
                status: error?.response?.status ?? null,
                data: error?.response?.data ?? null,
                message: error?.response?.data?.detail || error?.message || "An unexpected error occurred",
            } as IServiceError;
        }
    }

    const deletePaymentMethodById = async (id: string) => {
        try {
            const response = await api.delete(DELETE_PAYMENT_METHOD_BY_ID(id));
            return response;
        } catch (error: any) {
            throw {
                status: error?.response?.status ?? null,
                data: error?.response?.data ?? null,
                message: error?.response?.data?.detail || error?.message || "An unexpected error occurred",
            } as IServiceError;
        }
    }   

    return{
        getPaymentMethods,
        createPaymentMethod,
        getPaymentMethodById,
        updatePaymentMethodById,
        deletePaymentMethodById
    }
}
export default PaymentMethodService;