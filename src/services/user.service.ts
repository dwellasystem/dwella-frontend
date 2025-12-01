import { USER_URLS } from '../api/endpoint'
import api from '../api/api';
import type { IServiceError } from '../interfaces/error-handlers/IServiceError';
import type { User } from '../models/User.model';
import type { Paginated } from '../models/Paginated.model';

const UserService = () => {

    const {CREATE_USER, GET_USERS, GET_USER_BY_ID, UPDATE_USER_BY_ID, DELETE_USER_BY_ID} = USER_URLS;

    const getPaginatedUsers = async (params?: {}) => {
        try{
            const response = await api.get<Paginated<User>>(`http://127.0.0.1:8000/api/users-paginated`, {
                params: params
            })
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

    const getUsers = async (params?: {}) => {

        try {
            const response = await api.get(GET_USERS, {params: params})
            return response;   
        } catch (error: any) {
             throw {
                status: error?.response?.status ?? null,
                data: error?.response?.data ?? null,
                message: error?.response?.data?.detail  || error?.message || "An unexpected error occurred",
            } as IServiceError;
        }
    }

    const createUser = async (data: any) => {
        const response = await api.post(CREATE_USER, data);
        return response;
    }

    const getUserById = async (id: number | string) => {
        const response = await api.get(GET_USER_BY_ID(id));
        return response.data;
    }

    const updateUserById = async (id: number | string, data: FormData | Partial<User>, headers?: {}) => {
        const response = await api.patch(UPDATE_USER_BY_ID(id), data, {headers: headers});
        return response.data;
    }


    const deleteUserById = async (id: number | string) => {
        const response = await api.delete(DELETE_USER_BY_ID(id));
        return response;
    }

    return{
        createUser,
        getUsers,
        updateUserById,
        deleteUserById,
        getUserById,
        getPaginatedUsers
    }

}

export default UserService;