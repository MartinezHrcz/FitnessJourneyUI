
export interface FriendDTO {
    id: string;
    userId: string;
    friendId: string;
    friendName: string;
    friendEmail: string;
    isRequester: boolean;
    status: 'ACCEPTED' | 'DECLINED' | 'IN_PROGRESS' | 'BLOCKED' | string ;
    requestedTime: Date;
}

export interface CreateFriendDTO {
    userId: string;
    friendId: string;
}