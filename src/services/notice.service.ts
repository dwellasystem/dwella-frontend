import api from "../api/api";
import { NOTICES_URLS } from "../api/endpoint"
import type { IServiceError } from "../interfaces/error-handlers/IServiceError";
import type { Notice, NoticeDetail } from "../models/Notice.model";
import type { Paginated } from "../models/Paginated.model";

export const NoticeService = () => {

    const {CREATE_NOTICE, GET_NOTICES, DELETE_NOTICE_BY_ID, GET_NOTICE_BY_ID, UPDATE_NOTICE_BY_ID} = NOTICES_URLS;


    const getNotices = async (params?: {}) => {
        try {
            const response = await api.get<Paginated<NoticeDetail>>(GET_NOTICES, {params:params});
            return response.data;
        } catch (error: any) {
            throw {
                status: error?.response?.status ?? null,
                data: error?.response?.data ?? null,
                message: error?.response?.data?.detail || error?.message || "An unexpected error occurred",
            } as IServiceError;
        }
    }

    const getNoticeById = async (id: number) => {
        try {
            const response = await api.get<Notice>(GET_NOTICE_BY_ID(id));
            return response.data;
        } catch (error: any) {
            throw {
                status: error?.response?.status ?? null,
                data: error?.response?.data ?? null,
                message: error?.response?.data?.detail || error?.message || "An unexpected error occurred",
            } as IServiceError;
        }
    }

    const updateNoticeById = async (id: number, body: {}) => {
        try {
            const response = await api.put(UPDATE_NOTICE_BY_ID(id), body);
            return response.data;
        } catch (error: any) {
            throw {
                status: error?.response?.status ?? null,
                data: error?.response?.data ?? null,
                message: error?.response?.data?.detail || error?.message || "An unexpected error occurred",
            } as IServiceError;
        }
    }

    const createNotice = async (body: {}) => {
        try {
            const response = await api.post(CREATE_NOTICE, body);
            return response.data;
        } catch (error: any) {
            throw {
                status: error?.response?.status ?? null,
                data: error?.response?.data ?? null,
                message: error?.response?.data?.detail || error?.message || "An unexpected error occurred",
            } as IServiceError;
        }
    }

    const deleteNoticeById = async (id: number) => {
        try {
            const response = await api.delete(DELETE_NOTICE_BY_ID(id));
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
        getNotices,
        getNoticeById,
        updateNoticeById,
        createNotice,
        deleteNoticeById
        // getPaymentById,
        // updatePaymentById,
        // deletePaymentById
    };
}