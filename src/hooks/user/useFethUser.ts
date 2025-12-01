import { jwtDecode } from "jwt-decode";
import { type TokenType } from "../../contexts/auth/AuthContext";
import UserService from "../../services/user.service";
import type { ITokenPayload } from "../../interfaces/payloads/ITokenPayload";
import type { IServiceError } from "../../interfaces/error-handlers/IServiceError";

export const useFetchUser = async (token: TokenType) => {
    const {getUserById} = UserService();

    if(!token){
        console.log('no token available');
        return
    }
    const decodeToken = jwtDecode<ITokenPayload>(token?.access)

    try {
        const response = await getUserById(decodeToken.user_id)
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