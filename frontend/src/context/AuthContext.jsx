import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(localStorage.getItem("token"));

    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

    // Setup axios interceptor to include token in all requests
    useEffect(() => {
        const interceptor = axios.interceptors.request.use(
            (config) => {
                const storedToken = localStorage.getItem("token");
                if (storedToken) {
                    config.headers.Authorization = `Bearer ${storedToken}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        // Add response interceptor to handle 401 errors
        const responseInterceptor = axios.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.status === 401) {
                    // Token expired or invalid, logout user
                    logout();
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axios.interceptors.request.eject(interceptor);
            axios.interceptors.response.eject(responseInterceptor);
        };
    }, []);

    // Check if user is logged in on mount
    useEffect(() => {
        const checkAuth = async () => {
            const storedToken = localStorage.getItem("token");
            if (storedToken) {
                try {
                    const response = await axios.get(`${API_URL}/auth/me`);
                    setUser(response.data.user);
                    setToken(storedToken);
                } catch (error) {
                    console.error("Auth check failed:", error);
                    localStorage.removeItem("token");
                    setToken(null);
                    setUser(null);
                }
            }
            setLoading(false);
        };

        checkAuth();
    }, [API_URL]);

    const login = async (email, password) => {
        try {
            const response = await axios.post(`${API_URL}/auth/login`, {
                email,
                password,
            });

            const { token: newToken, user: userData } = response.data;
            localStorage.setItem("token", newToken);
            setToken(newToken);
            setUser(userData);
            return { success: true };
        } catch (error) {
            const errorMessage =
                error.response?.data?.error?.message || "Login failed. Please try again.";
            return { success: false, error: errorMessage };
        }
    };

    const register = async (name, email, password) => {
        try {
            const response = await axios.post(`${API_URL}/auth/register`, {
                name,
                email,
                password,
            });

            const { token: newToken, user: userData } = response.data;
            localStorage.setItem("token", newToken);
            setToken(newToken);
            setUser(userData);
            return { success: true };
        } catch (error) {
            const errorMessage =
                error.response?.data?.error?.message || "Registration failed. Please try again.";
            return { success: false, error: errorMessage };
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
    };

    const value = {
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!token,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
