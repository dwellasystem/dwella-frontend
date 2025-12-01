import type { IServiceError } from "../../interfaces/error-handlers/IServiceError";
import UserService from "../../services/user.service"


export const useCreateUser = async (data:any) => {
    const {createUser} = UserService();

    const userData = data
    try {
        const response = await createUser(userData);
        const {status, data, message} = response.data;
        return {status, data, message}
    } 
    catch (error: any) {
        throw {
            status: error?.response?.status ?? null,
            data: error?.response?.data ?? null,
            message: error?.response?.data?.detail  || error?.message || "An unexpected error occurred",
        } as IServiceError;
    }
}