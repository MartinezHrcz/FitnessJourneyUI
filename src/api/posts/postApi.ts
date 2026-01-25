import axiosClient from "../axiosClient.ts";
import type { PostDto, PostCreateDto } from "../../types/social/Post.ts";

export const postApi = {
    getAll: () => axiosClient.get<PostDto[]>("/post"),

    getByUserId: (userId: string) =>
        axiosClient.get<PostDto[]>(`/post/user/${userId}`),

    create: (data: PostCreateDto) =>
        axiosClient.post<PostDto>("/post", data),

    createWithImage: (userId: string, content: string, image?: File) => {
        const formData = new FormData();
        formData.append("userId", userId);
        formData.append("content", content);
        if (image) {
            formData.append("image", image);
        }
        return axiosClient.post("/post", formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
    },

    delete: (id: string) =>
        axiosClient.delete(`/post/${id}`),
}