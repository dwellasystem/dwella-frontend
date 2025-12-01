// src/auth/AuthContext.tsx
import { type ReactNode } from "@tanstack/react-router";
import { createContext, useContext, useEffect, useState } from "react";
import AuthService from "../../services/auth.service";
import type { IServiceError } from "../../interfaces/error-handlers/IServiceError";
import { useFetchUser } from "../../hooks/user/useFethUser";
import type { User } from "../../models/User.model";
import { jwtDecode } from "jwt-decode";
import type { ITokenPayload } from "../../interfaces/payloads/ITokenPayload";

// ✅ Define a clean Token type
export type TokenType = {
  refresh: string;
  access: string;
} | null;

// ✅ Define what LoginResponse returns (instead of importing from Login.tsx)
export type LoginResponse = {
  refresh: string;
  access: string;
};

// ✅ Enum Role
export const UserRole = {
  Admin: "admin",
  Employee: "employee",
  Resident: "resident",
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

// ✅ Context type
type AuthContextType = {
  token: TokenType;
  setToken: (value: React.SetStateAction<TokenType>) => void;
  login: (username: string, password: string) => Promise<LoginResponse>;
  logout: () => void;
  isLoading: boolean;
  setUser: (value: React.SetStateAction<User | undefined>) => void;
  user: User | undefined;
  role: UserRole | undefined;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ✅ Auth Provider
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const getInitialToken = (): TokenType => {
    const saved = localStorage.getItem("token");
    return saved ? JSON.parse(saved) : null;
  };

  const [token, setToken] = useState<TokenType>(getInitialToken);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | undefined>();
  const [role, setRole] = useState<UserRole | undefined>();

  useEffect(() => {
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const initUser = async () => {
      if (token) {
        try {
          const userData: User = await useFetchUser(token);
          const decode = jwtDecode<ITokenPayload>(token.access);
          setRole(decode.role as UserRole);
          setUser(userData);
        } catch (err) {
          console.log(err);
        }
      }
    };
    initUser();
  }, [token]);

  // ✅ Login now returns a LoginResponse
  const login = async (
    username: string,
    password: string
  ): Promise<LoginResponse> => {
    const { login: authLogin } = AuthService();

    try {
      const data: LoginResponse = await authLogin(username, password);
      localStorage.setItem("token", JSON.stringify(data));
      setToken(data);
      setIsLoading(false);
      return data; // ✅ Return LoginResponse
    } catch (error) {
      const err = error as IServiceError;
      console.error("Login failed:", err);
      throw err;
    }
  };

  const logout = () => {
    localStorage.clear();
    setToken(null);
    window.location.reload();
  };

  return (
    <AuthContext.Provider
      value={{ token, user, role, setUser, setToken, login, logout, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ✅ useAuth hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
