import {Heart, MessageSquare, Trash2, Clock, Send} from "lucide-react";
import type { PostDto } from "../types/social/Post.ts";
import {useEffect, useState} from "react";
import type {CommentDTO} from "../types/social/Comment.ts";
import {commentApi} from "../api/comments/commentApi.ts";
import {postApi} from "../api/posts/postApi.ts";
import {fileShareApi} from "../api/file/fileShareApi.ts";
import UserAvatar from "./UserAvatar.tsx";

interface PostCardProps {
    post: PostDto;
    currentUserId: string;
    onDelete: (id: string) => void;
}

export const PostCard = ({ post, currentUserId, onDelete }: PostCardProps) => {

    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState<CommentDTO[]>([]);
    const [newComment, setNewComment] = useState("");
    const [liked, setLiked] = useState(post.likedByCurrentUser);
    const [likeCount, setLikeCount] = useState(post.likeCount);

    useEffect(() => {
        if (showComments) {
            fetchComments();
        }
    }, [showComments]);

    const SecureImage = ({ filename, alt }: { filename: string; alt: string }) => {
        const [imgSrc, setImgSrc] = useState<string>("");

        useEffect(() => {
            if (!filename) return;

            fileShareApi.getFile(filename)
                .then((response) => {
                    const url = URL.createObjectURL(response.data);
                    setImgSrc(url);
                })
                .catch((err) => console.error("Could not fetch secure image", err));

            return () => {
                if (imgSrc) URL.revokeObjectURL(imgSrc);
            };
        }, [filename]);

        return imgSrc ? <img src={imgSrc} alt={alt} /> : <span>Loading image...</span>;
    };

    const fetchComments = async () => {
        try {
            const res = await commentApi.getByPostId(post.id);
            setComments(res.data);
        } catch (err) {
            console.error("Failed to load comments", err);
        }
    };

    const handleAddComment = async () => {
        if (!newComment.trim()) return;
        try {
            const res = await commentApi.create(
                { content: newComment },
                post.id,
                currentUserId
            );
            setComments([...comments, res.data]);
            setNewComment("");
        } catch (err) {
            console.error("Failed to post comment", err);
        }
    };

    const handleDeleteComment = async (commentId: string) => {
        try {
            await commentApi.delete(commentId);
            setComments(comments.filter((c) => c.id !== commentId));
        } catch (err) {
            console.error("Failed to delete comment", err);
        }
    };

    const handleLike = async () => {
        const previouslyLiked = liked;
        setLiked(!previouslyLiked);
        setLikeCount(prev => previouslyLiked ? prev - 1 : prev + 1);

        try {
            await postApi.like(post.id);
        } catch (err) {
            setLiked(previouslyLiked);
            setLikeCount(post.likeCount);
            console.error("Failed to toggle like", err);
        }
    };

    return (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 mb-6 transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <UserAvatar
                        name={post.userName}
                        imageFilename={post.userProfilePicture}
                        className="w-10 h-10 shadow-lg shadow-blue-100 dark:shadow-none"
                        textClassName="text-sm"
                    />
                    <div>
                        <p className="font-bold text-slate-800 dark:text-slate-100">{post.userName || "User"}</p>
                        <div className="flex items-center gap-1 text-slate-400 dark:text-slate-500 text-xs font-medium">
                            <Clock size={12} />
                            {new Date(post.sentTime).toLocaleDateString()}
                        </div>
                    </div>
                </div>
                {post.userId === currentUserId && (
                    <button onClick={() => onDelete(post.id)} className="text-slate-300 dark:text-slate-700 hover:text-red-500 transition-colors">
                        <Trash2 size={18} />
                    </button>
                )}
            </div>

            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">{post.content}</p>

            {post.imageUrl && (
                <div className="mt-4 mb-4 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                    <SecureImage filename={post.imageUrl} alt={"post picture"} />
                </div>
            )}

            <div className="flex gap-6 pt-4 border-t border-slate-50 dark:border-slate-800">
                <button
                    onClick={handleLike}
                    className={`flex items-center gap-2 transition-colors text-sm font-bold ${
                        liked ? 'text-red-500' : 'text-slate-500 dark:text-slate-400 hover:text-red-500'
                    }`}>
                    <Heart size={18}
                           fill={liked ? "currentColor" : "none"}
                           className={`transition-transform duration-200 ${liked ? "scale-110" : "scale-100"}`} />
                    <span className="tabular-nums">{likeCount}</span>
                </button>
                <button
                    onClick={() => setShowComments(!showComments)}
                    className={`flex items-center gap-2 transition-colors text-sm font-bold ${
                        showComments ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400 hover:text-blue-600'
                    }`}
                >
                    <MessageSquare size={18} /> Comment
                </button>
            </div>

            {showComments && (
                <div className="mt-4 pt-4 border-t border-slate-50 dark:border-slate-800 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="space-y-3">
                        {comments.map((comment) => (
                            <div key={comment.id} className="flex gap-3 items-start group">
                                <UserAvatar
                                    name={comment.userName}
                                    imageFilename={comment.userProfilePicture}
                                    className="w-8 h-8"
                                    textClassName="text-xs"
                                />
                                <div className="flex-1 bg-slate-50 dark:bg-slate-800 rounded-2xl px-4 py-2 relative">
                                    <p className="font-bold text-xs text-slate-800 dark:text-slate-200">{comment.userName}</p>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">{comment.content}</p>
                                    {comment.userId === currentUserId && (
                                        <button
                                            onClick={() => handleDeleteComment(comment.id)}
                                            className="absolute top-2 right-2 text-slate-300 dark:text-slate-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-2 items-center mt-2">
                        <input
                            type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Write a comment..."
                            className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all border border-transparent dark:border-slate-700 placeholder:text-slate-400 dark:placeholder:text-slate-600"
                            onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                        />
                        <button
                            onClick={handleAddComment}
                            disabled={!newComment.trim()}
                            className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-full transition-colors disabled:opacity-30"
                        >
                            <Send size={18} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};