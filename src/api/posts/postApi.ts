import axiosClient from "../axiosClient.ts";
import type {PostDto, PostCreateDto, PostUpdateDto} from "../../types/social/Post.ts";

export const postApi = {
    getAll: () => axiosClient.get<PostDto[]>("/post"),

    getByUserId: (userId: string) =>
        axiosClient.get<PostDto[]>(`/post/user/${userId}`),

    create: (data: PostCreateDto) =>
        axiosClient.post<PostDto>("/post", data),

    createWithImage: (content: string, image?: File) => {
        const formData = new FormData();

        formData.append("content", new Blob([content], { type: "application/json" }));

        if (image) {
            formData.append("image", image);
        }

        return axiosClient.post<PostDto>("/post/with-image", formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
    },

    update: (id: string, data: PostUpdateDto) =>
        axiosClient.put<PostDto>(`/post/${id}`, data),

    like: (id: string) =>
        axiosClient.post(`/post/${id}/like`),

    delete: (id: string) =>
        axiosClient.delete(`/post/${id}`),
}