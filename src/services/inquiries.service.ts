import api from "../api/api";
import { INQUIRIES_URLS } from "../api/endpoint";
import type { IServiceError } from "../interfaces/error-handlers/IServiceError";
import { type Inquiry } from "../models/Inquiry.model";
import { type Paginated } from "../models/Paginated.model";

const InquiryService = () => {
    const {CREATE_INQUIRY, DELETE_INQUIRY_BY_ID, UPDATE_INQUIRY_BY_ID, GET_INQUIRIES, GET_INQUIRY_BY_ID, OPEN_INQUIRIES } = INQUIRIES_URLS;

    const getInquiries = async (params?:{}) => {
        try {
            const response = await api.get<Paginated<Inquiry>>(GET_INQUIRIES, {params: params});
            return response.data;
        } catch (error: any) {
            throw {
                    status: error?.response?.status ?? null,
                    data: error?.response?.data ?? null,
                    message: error?.response?.data?.detail || error?.message || "An unexpected error occurred",
                } as IServiceError;
        }
    };

    const createInquiry = async (body:{}, headers?:{}) => {
        try {
            const response = await api.post<Inquiry>(CREATE_INQUIRY, body, {headers: headers});
            return response.data;
        } catch (error: any) {
            throw {
                        status: error?.response?.status ?? null,
                        data: error?.response?.data ?? null,
                        message: error?.response?.data?.detail || error?.message || "An unexpected error occurred",
                } as IServiceError;
        }
        
    };

    const getInquiryById = async (id: number) => {
        try {
            const response = await api.get<Inquiry>(GET_INQUIRY_BY_ID(id))
            return response.data;
        } catch (error: any) {
            throw {
                    status: error?.response?.status ?? null,
                    data: error?.response?.data ?? null,
                    message: error?.response?.data?.detail || error?.message || "An unexpected error occurred",
                } as IServiceError;
        }
    }

    const updateInquiryById = async (id: number, body: {}) => {
        try {
            const response = await api.put<Inquiry>(UPDATE_INQUIRY_BY_ID(id), body)
            return response.data;
        } catch (error: any) {
            throw {
                    status: error?.response?.status ?? null,
                    data: error?.response?.data ?? null,
                    message: error?.response?.data?.detail || error?.message || "An unexpected error occurred",
                } as IServiceError;
        }
    }

    const deleteInquiryById = async (id: number) => {
        try {
            const response = await api.delete<Inquiry>(DELETE_INQUIRY_BY_ID(id))
            return response.data;
        } catch (error: any) {
            throw {
                    status: error?.response?.status ?? null,
                    data: error?.response?.data ?? null,
                    message: error?.response?.data?.detail || error?.message || "An unexpected error occurred",
                } as IServiceError;
        }
    }

    const totalOpenInquiries = async () => {
        try {
            const response = await api.get(OPEN_INQUIRIES);
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
        getInquiries,
        getInquiryById,
        updateInquiryById,
        deleteInquiryById,
        createInquiry,
        totalOpenInquiries
    }
}

export default InquiryService;