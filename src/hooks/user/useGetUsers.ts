import { useEffect, useState } from "react";
import UserService from "../../services/user.service";
import type { User } from "../../models/User.model";
import type { IServiceError } from "../../interfaces/error-handlers/IServiceError";
import type { Paginated } from "../../models/Paginated.model";
import api from "../../api/api";

export const useGetUsers = (filters: {} = "") => {
  const { getUsers, getPaginatedUsers, deleteUserById, updateUserById } = UserService();

  const [users, setUsers] = useState<Paginated<User>>();
  const [usersAsOptions, setUsersAsOptions] = useState<User[]>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  
    const nextButton = async (url: string) => {
    const response = await api.get(url);
    setUsers(response.data);
    setPageNumber((prev) => prev + 1);
  };

  const prevButton = async (url: string) => {
    const response = await api.get(url);
    setUsers(response.data);
    setPageNumber((prev) => prev - 1);
  };

  const fetchUsers = async () => {
    try {
      const response = await getPaginatedUsers(filters);
      setUsers(response.data);
    } catch (error: any) {
      const err = error as IServiceError;
      if (err.status !== 200) setError("Server Error");
    } finally {
      setLoading(false);
    }
  };

  const getAllUsers = async () => {
    try {
      const response = await getUsers(filters);
      setUsersAsOptions(response.data);
    } catch (error: any) {
      const err = error as IServiceError;
      if (err.status !== 200) setError("Server Error");
    } finally {
      setLoading(false);
    }
  }

  const deleteUser = async (id: number) => {
    try{
        await deleteUserById(id);
        fetchUsers();
    }catch(error){
        const err = error as IServiceError;
        if(err.status !== 200) setError("Server Error");
    }
 }

 const updateUserProfile = async (id: number, data: FormData | User, headers?: {}) => {
    try{
        const response = await updateUserById(id, data, headers);
        return response;
    }
    catch(error){
      const err = error as IServiceError;
      if(err.status !== 200) setError("Server Error");
    }
 }

  useEffect(() => {
    fetchUsers();
    getAllUsers();
  }, [filters]);

  return { users, loading, error, fetchUsers, usersAsOptions,updateUserProfile, deleteUser, nextButton, prevButton, pageNumber};
};
