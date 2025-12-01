import { useEffect, useState } from 'react'
import { API_BASE_URL } from '../../api/endpoint';
import api from '../../api/api';

type UserSummary = {
    totalUsers: number;
    totalActiveResidents: number;
    totalInactiveResidents: number;
    totalActiveEmployees: number;
    totalInactiveEmployees: number;
}

function useUserSummary() {
  const [userSummary, setUserSummary] = useState<UserSummary | undefined>();

  const fetchUserSummary = async () => {
    const response = await api.get(`${API_BASE_URL}/users/summary/`);
    setUserSummary(response.data)
  }
  
  useEffect(() => {
    fetchUserSummary();
  },[])
  return {
    userSummary
  }
}

export default useUserSummary