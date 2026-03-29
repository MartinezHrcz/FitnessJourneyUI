import axiosClient from "../axiosClient.ts";
import type {updatePassword, updateUser, user} from "../../types/User.ts";

export const userApi = {
    getAllUsers: () => axiosClient.get<Array<user>>("/user"),
    getUserSearch: (params: {id?:string; name?: string; email?: string}) => axiosClient.get<user[]>("/user/search", {params}),
    updateUser: (id: string,data: updateUser) => axiosClient.put<user>(`/user/${id}`, data),
    updateProfilePicture: (image: File) => {
        const formData = new FormData();
        formData.append("image", image);

        return axiosClient.post<user>("/user/profile-picture", formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
    },
    updatePassword: (id:string, data: updatePassword) => axiosClient.put<user>(`/pwd/${id}`, data),
    deleteUser: (id: string) => axiosClient.delete<string>(`/user/${id}`),
}