export interface PostDto {
    id: string;
    title: string;
    content: string;
    userId: string;
    userName: string;
    imageUrl: string | null;
    sentTime: string;
    likeCount: number;
    commentCount: number;
    likedByCurrentUser: boolean;
}

export interface PostCreateDto {
    title: string;
    content: string;
    userId: string;
}

export interface PostUpdateDto {
    title: string;
    content: string;
    userId: string;
}