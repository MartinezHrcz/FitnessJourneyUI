import axiosClient from "../axiosClient.ts";
import type { PostDto, PostCreateDto } from "../../types/social/Post.ts";

export const postApi = {
    getAll: () => axiosClient.get<PostDto[]>("/post"),

    getByUserId: (userId: string) =>
        axiosClient.get<PostDto[]>(`/post/user/${userId}`),

    create: (data: PostCreateDto) =>
        axiosClient.post<PostDto>("/post", data),

    delete: (id: string) =>
        axiosClient.delete(`/post/${id}`)
};