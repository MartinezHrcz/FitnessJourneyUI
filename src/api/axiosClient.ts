import axios, {AxiosHeaders, type AxiosError, type AxiosInstance, type InternalAxiosRequestConfig} from "axios";

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:9090/api').replace(/\/+$/, '');

const axiosClient : AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true
});

axiosClient.interceptors.request.use((config) =>{
    const token = localStorage.getItem("token");
    if(token && !config.url?.includes("/auth/")){
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

let isRefreshing = false;
let failedQueue: Array<{
    resolve: (token: string) => void;
    reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
    failedQueue.forEach((promise) => {
        if (error) {
            promise.reject(error);
        } else if (token) {
            promise.resolve(token);
        }
    });

    failedQueue = [];
};

const isAuthEndpoint = (url?: string) => {
    return !!url && (url.includes("/auth/login") || url.includes("/auth/register") || url.includes("/auth/refresh"));
};

axiosClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as RetryableRequestConfig | undefined;
        const status = error.response?.status;

        if (!originalRequest || status !== 401 || originalRequest._retry || isAuthEndpoint(originalRequest.url)) {
            return Promise.reject(error);
        }

        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
            localStorage.removeItem("token");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("user");
            return Promise.reject(error);
        }

        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({
                    resolve: (token: string) => {
                        if (!originalRequest.headers) {
                            originalRequest.headers = new AxiosHeaders();
                        }
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        resolve(axiosClient(originalRequest));
                    },
                    reject: (queueError) => reject(queueError),
                });
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
            const refreshResponse = await axios.post(
                `${API_BASE_URL}/auth/refresh`,
                { refreshToken },
                { withCredentials: true }
            );

            const newToken = refreshResponse.data?.token as string;
            const newRefreshToken = refreshResponse.data?.refreshToken as string | undefined;
            const refreshedUser = refreshResponse.data?.user;

            localStorage.setItem("token", newToken);
            if (newRefreshToken) {
                localStorage.setItem("refreshToken", newRefreshToken);
            }
            if (refreshedUser) {
                localStorage.setItem("user", JSON.stringify(refreshedUser));
            }

            if (!originalRequest.headers) {
                originalRequest.headers = new AxiosHeaders();
            }
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            processQueue(null, newToken);

            return axiosClient(originalRequest);
        } catch (refreshError) {
            processQueue(refreshError, null);
            localStorage.removeItem("token");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("user");
            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    }
);

export default axiosClient;