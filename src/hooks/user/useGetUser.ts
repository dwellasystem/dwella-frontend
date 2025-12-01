import { useEffect, useState } from "react";
import type { User } from "../../models/User.model";
import UserService from "../../services/user.service"
import type { IServiceError } from "../../interfaces/error-handlers/IServiceError";

export const useGetUser = (id: any) => {

    const {getUserById} = UserService();
    const [user, setUser] = useState<User>({});
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);

   useEffect(()=>{
    const fetchUser = async () => {
         try {
            const response: User = await getUserById(id);
            setUser(response)
        } 
        catch (error: any) {
            const err = error as IServiceError
            if(err.status !== 200) setError('Server Error')
        }
        finally{
            setLoading(false)
        }
    }
    fetchUser();
   },[])

   return { user, loading, error }

}