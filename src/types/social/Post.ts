export type PostVisibility = "GLOBAL" | "FRIENDS_ONLY";

export interface PostDto {
    id: string;
    title: string;
    content: string;
    userId: string;
    userName: string;
    userProfilePicture?: string | null;
    imageUrl: string | null;
    sentTime: string;
    likeCount: number;
    commentCount: number;
    likedByCurrentUser: boolean;
    visibility?: PostVisibility;
}

export interface PostCreateDto {
    title: string;
    content: string;
    userId: string;
    visibility?: PostVisibility;
}

export interface PostUpdateDto {
    title: string;
    content: string;
    userId: string;
    visibility?: PostVisibility;
}