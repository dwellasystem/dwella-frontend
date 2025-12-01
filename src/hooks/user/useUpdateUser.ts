import type { IServiceError } from "../../interfaces/error-handlers/IServiceError";
import type { User } from "../../models/User.model";
import UserService from "../../services/user.service"

export const useUpdateUser = async (id: any, data: any) => {
    const {updateUserById} = UserService();

    const userData = data;

    try {
        const response: User = await updateUserById(id, userData);
        return response;

    } catch (error: any) {
         throw {
            status: error?.response?.status ?? null,
            data: error?.response?.data ?? null,
            message: error?.response?.data?.detail  || error?.message || "An unexpected error occurred",
        } as IServiceError;
    }
}