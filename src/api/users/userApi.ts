import axiosClient from "../axiosClient.ts";

export const userApi = {
    getAllUsers: () => axiosClient.get("/user"),
    getUserSearch: (params: {id?:string; name?: string; email?: string}) => axiosClient.get("/user/search", {params}),
    updateUser: (id: string,data) => axiosClient.post(`/user/update/${id}`, data),
    deleteUser: (id: string) => axiosClient.delete(`/user/${id}`),
}