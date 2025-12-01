import api from "../api/api";
import { ASSIGNED_UNIT_URLS } from "../api/endpoint"
import type { IServiceError } from "../interfaces/error-handlers/IServiceError";

const AssignedUnitService = () => {

    const { CREATE_ASSIGNED_UNIT, 
            GET_ASSIGNED_UNITS, 
            GET_ASSIGNED_UNIT_BY_ID, 
            UPDATE_ASSIGNED_UNIT_BY_ID, 
            DELETE_ASSIGNED_UNIT_BY_ID} = ASSIGNED_UNIT_URLS;

    const getAssigneUnits = async (filter?: {}) => {
       try {
            const response = await api.get(GET_ASSIGNED_UNITS, {params: filter});
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

    const createAssignedUnit = async (data: any) => {
        try {
            const response = await api.post(CREATE_ASSIGNED_UNIT, data);
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

    const getAssigneUnitById = async (id: string | number) => {
        try {
            const response = await api.get(GET_ASSIGNED_UNIT_BY_ID(id));
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

    const updateAssigneUnitById = async (id: string | number, data: any) => {
        try {
            const response = await api.put(UPDATE_ASSIGNED_UNIT_BY_ID(id), data);
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

    const deleteAssigneUnitById = async (id: string | number) => {
        try {
            const response = await api.delete(DELETE_ASSIGNED_UNIT_BY_ID(id));
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

    return {
        getAssigneUnits,
        createAssignedUnit,
        getAssigneUnitById,
        updateAssigneUnitById,
        deleteAssigneUnitById
    }
}

export default AssignedUnitService;