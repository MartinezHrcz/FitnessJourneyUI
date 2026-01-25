import {Heart, MessageSquare, Trash2, Clock, Send} from "lucide-react";
import type { PostDto } from "../types/social/Post.ts";
import {useEffect, useState} from "react";
import type {CommentDTO} from "../types/social/Comment.ts";
import {commentApi} from "../api/comments/commentApi.ts";

interface PostCardProps {
    post: PostDto;
    currentUserId: string;
    onDelete: (id: string) => void;
}

export const PostCard = ({ post, currentUserId, onDelete }: PostCardProps) => {

    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState<CommentDTO[]>([]);
    const [newComment, setNewComment] = useState("");

    useEffect(() => {
        if (showComments) {
            fetchComments();
        }
    }, [showComments]);

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

    return (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 mb-6">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                        {post.userName.charAt(0).toUpperCase() || "U"}
                    </div>
                    <div>
                        <p className="font-bold text-slate-800">{post.userName || "User"}</p>
                        <div className="flex items-center gap-1 text-slate-400 text-xs">
                            <Clock size={12} />
                            {new Date(post.sentTime).toLocaleDateString()}
                        </div>
                    </div>
                </div>
                {post.userId === currentUserId && (
                    <button onClick={() => onDelete(post.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                        <Trash2 size={18} />
                    </button>
                )}
            </div>

            <p className="text-slate-600 leading-relaxed mb-4">{post.content}</p>

            <div className="flex gap-4 pt-4 border-t border-slate-50">
                <button className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors text-sm font-medium">
                    <Heart size={18} /> Like
                </button>
                <button
                    onClick={() => setShowComments(!showComments)}
                    className={`flex items-center gap-2 transition-colors text-sm font-medium ${showComments ? 'text-blue-600' : 'text-slate-500 hover:text-blue-600'}`}
                >
                    <MessageSquare size={18} /> Comment
                </button>
            </div>

            {showComments && (
                <div className="mt-4 pt-4 border-t border-slate-50 space-y-4">
                    <div className="space-y-3">
                        {comments.map((comment) => (
                            <div key={comment.id} className="flex gap-3 items-start group">
                                <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-slate-600 text-xs font-bold">
                                    {comment.userName.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1 bg-slate-50 rounded-2xl px-4 py-2 relative">
                                    <p className="font-bold text-xs text-slate-800">{comment.userName}</p>
                                    <p className="text-sm text-slate-600">{comment.content}</p>
                                    {comment.userId === currentUserId && (
                                        <button
                                            onClick={() => handleDeleteComment(comment.id)}
                                            className="absolute top-2 right-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
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
                            className="flex-1 bg-slate-100 rounded-xl px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                            onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                        />
                        <button
                            onClick={handleAddComment}
                            disabled={!newComment.trim()}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors disabled:opacity-30"
                        >
                            <Send size={18} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};