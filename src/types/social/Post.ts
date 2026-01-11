export interface PostDto {
    id: string;
    title: string;
    content: string;
    userId: string;
    userName: string;
    sentTime: Date;
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