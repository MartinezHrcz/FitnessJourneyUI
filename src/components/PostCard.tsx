import { Heart, MessageSquare, Trash2, Clock } from "lucide-react";
import type { PostDto } from "../types/social/Post.ts";

interface PostCardProps {
    post: PostDto;
    currentUserId: string;
    onDelete: (id: string) => void;
}

export const PostCard = ({ post, currentUserId, onDelete }: PostCardProps) => {
    return (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 mb-6">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                        {"User"}
                    </div>
                    <div>
                        <p className="font-bold text-slate-800">{post.id || "User"}</p>
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
                <button className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors text-sm font-medium">
                    <MessageSquare size={18} /> Comment
                </button>
            </div>
        </div>
    );
};