import axiosClient from "../axiosClient.ts";
import type {CreateMessageDto, MessageDto} from "../../types/social/Message.ts";


export const messageApi = {
    getMessages: (senderId: string, recipientId: string) =>
        axiosClient.get<Array<MessageDto>>(`/message/${senderId}/${recipientId}`),

    create: (data: CreateMessageDto) =>
        axiosClient.post(`/message`, data),

    getBySenderId: (senderId: string) =>
        axiosClient.get(`/message/bysender/${senderId}`),

    delete: (id: string) =>
        axiosClient.delete(`/message/${id}`),
}