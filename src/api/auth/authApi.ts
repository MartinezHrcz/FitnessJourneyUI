import axiosClient from "../axiosClient.ts";
import type {createUserDTO} from "../../types/User.ts";
import type {authRequest, authResponse} from "../../types/Auth.ts";

export const authApi = {
    registerUser: (data: createUserDTO) =>
        axiosClient.post<authResponse>(`/auth/register`, data),
    login: (data: authRequest) =>
        axiosClient.post<authResponse>(`/auth/login`, data),
}