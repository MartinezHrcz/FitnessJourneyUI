export interface MessageDto {
    id: string,
    senderId: string,
    recipientId: string,
    content: string,
    sentTime: Date,
}

export interface CreateMessageDto {
    senderId: string,
    recipientId: string,
    content: string,
}

export interface UpdateMessageDto {
    content: string,
}