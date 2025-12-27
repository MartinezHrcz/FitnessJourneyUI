import axiosClient from "../axiosClient.ts";
import type {FriendDTO, CreateFriendDTO} from "../../types/social/Friend.ts";

export const friendApi = {
    getAll: () =>
        axiosClient.get<Array<FriendDTO>>("/friend"),

    getFriendsOfUser: (id: string) =>
        axiosClient.get<FriendDTO[]>(`/friend/user/${id}`),

    create: (data: CreateFriendDTO) =>
        axiosClient.post<FriendDTO>('/friend', data),

    acceptRequest: (id: string) =>
        axiosClient.put<FriendDTO>(`/friend/${id}/accept`),

    delete: (id: string) =>
        axiosClient.delete(`/friend/${id}`),
}