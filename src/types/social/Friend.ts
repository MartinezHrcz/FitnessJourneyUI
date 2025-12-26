
export interface FriendDTO {
    id: string;
    userId: string;
    friendId: string;
    status: 'ACCEPTED' | 'DECLINED' | 'IN_PROGRESS' | 'BLOCKED' | string ;
    requestedTime: Date;
}

export interface CreateFriendDTO {
    userId: string;
    friendId: string;
}