import { jwtDecode } from "jwt-decode";
import type { ITokenPayload } from "../interfaces/payloads/ITokenPayload";
import AuthService from "../services/auth.service";
import { API_BASE_URL } from "./endpoint";
import axios from "axios";
import type { TokenType } from "../contexts/auth/AuthContext";


const api = axios.create({
baseURL: API_BASE_URL,
})


let isInterceptorAttached = false;

let getToken: () => TokenType = () => null;

export const setupInterceptors = (tokenGetter: () => TokenType, setToken: (val:TokenType) => void) => {
    
    getToken = tokenGetter;

    if (isInterceptorAttached) return;

    api.interceptors.request.use(
        async (config) => {
            const token = getToken();
            const expirationTime = Date.now() / 1000; 

             if (!token) {
                console.warn("No token available.");
                return config;
            }

            let currentAccess = token.access;
            let currentRefresh = token.refresh;

            try {
                const decodedAccess = jwtDecode<ITokenPayload>(token.access);

                // ✅ Check if refresh token is still valid
                if (decodedAccess.exp < expirationTime + 5) {
                    const { refreshToken } = AuthService();
                    const newToken = await refreshToken(token.refresh);

                    if(newToken.access && newToken.refresh){
                        currentAccess = newToken.access;
                        currentRefresh = newToken.refresh;

                        const updatedToken = {
                            access: currentAccess,
                            refresh: currentRefresh,
                        };

                        localStorage.setItem("token", JSON.stringify(updatedToken));
                        setToken(updatedToken);
                    }else{
                        console.warn("Refresh response missing tokens");
                    }
                }
                // ✅ Always use the current (refreshed or original) access token
                config.headers["Authorization"] = `Bearer ${currentAccess}`;

                return config;


            } catch (error) {
                localStorage.clear();
                setToken(null);
                window.location.href = "/login";
            }
            return config;
        }
    );
    isInterceptorAttached = true;
};

export default api;