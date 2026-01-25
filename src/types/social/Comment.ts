export interface CommentDTO
{
    id: string;
    postId: string;
    userId: string;
    userName: string;
    userProfilePicture: string;
    content: string;
    sentTime: Date;
}

export interface CommentCreateDTO
{
    content: string;
}