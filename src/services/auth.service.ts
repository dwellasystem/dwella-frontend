import axios from "axios";
import { AUTH_URLS } from "../api/endpoint"
import type { IServiceError } from "../interfaces/error-handlers/IServiceError";

const AuthService = () => {

    const login = async (username: string, password: string) => {
        try{
            const response = await axios.post(AUTH_URLS.LOGIN, {
                username,
                password
            });
            return response.data;
            
        } catch(error: any){
            throw {
                status: error?.response?.status ?? null,
                data: error?.response?.data ?? null,
                message: error?.response?.data?.detail  || error?.message || "An unexpected error occurred",
            } as IServiceError;
        }
        
    }

    const refreshToken = async (refresh_token: string | null) => {
        try {
            const response = await axios.post(AUTH_URLS.REFRESH_TOKEN, {
                refresh: refresh_token
            });

            return response.data;
        } catch (error: any) {
            throw {
                status: error?.response?.status ?? null,
                data: error?.response?.data ?? null,
                message: error?.response?.data?.detail  || error?.message || "An unexpected error occurred",
            } as IServiceError;
        }
    }

    return {
        login,
        refreshToken
    }
}

export default AuthService;