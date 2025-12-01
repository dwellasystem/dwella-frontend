import api from "../api/api";
import { UNIT_URLS } from "../api/endpoint"
import type { IServiceError } from "../interfaces/error-handlers/IServiceError";

const UnitService = () => {

    const {GET_UNITS, CREATE_UNIT,GET_UNIT_BY_ID, UPDATE_UNIT_BY_ID, DELETE_UNIT_BY_ID} = UNIT_URLS;

    const getUnits = async (filters?:{}) => {
        
        try {
            const response = await api.get(GET_UNITS, {params: filters})
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


    const createUnit = async (data: any) => {
        try {
            const response = await api.post(CREATE_UNIT, data)
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


    const getUnitById = async (id: string | number) => {
        
        try {
            const response = await api.get(GET_UNIT_BY_ID(id))
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

    
    const updateUnitById = async (id: string | number, data: {}) => {
        
        try {
            const response = await api.put(UPDATE_UNIT_BY_ID(id), data)
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


    const deletUnitById = async (id: string | number) => {
        
        try{
            const response = await api.delete(DELETE_UNIT_BY_ID(id))
            return response;
        }
        catch(error: any){
            throw {
                    status: error?.response?.status ?? null,
                    data: error?.response?.data ?? null,
                    message: error?.response?.data?.detail  || error?.message || "An unexpected error occurred",
            } as IServiceError;
        }
    }

    return {
        getUnits,
        createUnit,
        getUnitById,
        updateUnitById,
        deletUnitById
    }
}

export default UnitService;