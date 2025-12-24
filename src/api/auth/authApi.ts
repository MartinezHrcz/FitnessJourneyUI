import axiosClient from "../axiosClient.ts";
import type {createUser} from "../../types/User.ts";
import type {authRequest, authResponse} from "../../types/Auth.ts";

export const authApi = {
    registerUser: (data: createUser) =>
        axiosClient.post<authResponse>(`/auth/register`, data),
    login: (data: authRequest) =>
        axiosClient.post<authResponse>(`/auth/login`, data),
}