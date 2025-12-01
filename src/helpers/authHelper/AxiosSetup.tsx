import { useEffect } from "react";
import { useAuth } from "../../contexts/auth/AuthContext";
import { setupInterceptors } from '../../api/api';

export const AxiosSetup = () => {
  const { token, setToken } = useAuth();

  useEffect(() => {
    if (token) {
      setupInterceptors(() => token, setToken);
    }
  }, [token, setToken]);

  return null; // ✅ Must return something (or null) to be a valid component
};