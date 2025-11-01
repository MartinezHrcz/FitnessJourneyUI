import axiosClient from "../axiosClient.ts";
import type {updatePasswordDTO, updateUserDTO, userDTO} from "../../types/User.ts";

export const userApi = {
    getAllUsers: () => axiosClient.get<Array<userDTO>>("/user"),
    getUserSearch: (params: {id?:string; name?: string; email?: string}) => axiosClient.get<userDTO>("/user/search", {params}),
    updateUser: (id: string,data: updateUserDTO) => axiosClient.put<userDTO>(`/user/update/${id}`, data),
    updatePassword: (id:string, data: updatePasswordDTO) => axiosClient.put<userDTO>(`/pwd/${id}`, data),
    deleteUser: (id: string) => axiosClient.delete<string>(`/user/${id}`),
}