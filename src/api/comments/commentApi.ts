import axiosClient from "../axiosClient.ts";
import type { CommentDTO, CommentCreateDTO } from "../../types/social/Comment.ts";

export const commentApi = {
    getAll: () =>
        axiosClient.get<CommentDTO[]>("/comment"),

    getById: (id: string) =>
        axiosClient.get<CommentDTO>(`/comment/${id}`),

    getByPostId: (postId: string) =>
        axiosClient.get<CommentDTO[]>(`/comment/post/${postId}`),

    getByUserId: (userId: string) =>
        axiosClient.get<CommentDTO[]>(`/comment/user/${userId}`),

    getByPostAndUser: (postId: string, userId: string) =>
        axiosClient.get<CommentDTO[]>(`/comment/post/${postId}/user/${userId}`),

    create: (data: CommentCreateDTO, postId: string, userId: string) =>
        axiosClient.post<CommentDTO>(`/comment/post/${postId}/user/${userId}`, data),

    update: (id: string, content: string) =>
        axiosClient.put<CommentDTO>(`/comment/${id}`,content, {
            headers: { 'Content-Type': 'text/plain' }
        }),

    delete: (id: string) =>
        axiosClient.delete(`/comment/${id}`),
};