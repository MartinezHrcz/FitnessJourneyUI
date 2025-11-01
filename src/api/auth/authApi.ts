import axiosClient from "../axiosClient.ts";

export const authApi = {
    registerUser: (data) => axiosClient.post(`/auth/register`, data),
    login: (data) => axiosClient.post(`/auth/login`, data),
}