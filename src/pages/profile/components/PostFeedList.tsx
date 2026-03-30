import {PostCard} from "../../../components/PostCard.tsx";
import type {PostDto} from "../../../types/social/Post.ts";
import type {PostFeedType} from "./PostFeedTabs.tsx";

interface PostFeedListProps {
    posts: PostDto[];
    currentUserId: string;
    activeFeed: PostFeedType;
    onDeletePost: (id: string) => void;
    onEditPost?: (post: PostDto) => void;
}

const PostFeedList = ({posts, currentUserId, activeFeed, onDeletePost, onEditPost}: PostFeedListProps) => {
    if (posts.length === 0) {
        return (
            <div className="text-center py-16 text-slate-400 dark:text-slate-500 bg-slate-50/50 dark:bg-slate-900/20 rounded-3xl border-2 border-dashed border-slate-100 dark:border-slate-800">
                {activeFeed === "friends"
                    ? "No posts from your friends yet."
                    : "No posts yet. Start the conversation!"}
            </div>
        );
    }

    return (
        <>
            {posts.map((post) => (
                <PostCard
                    key={post.id}
                    post={post}
                    currentUserId={currentUserId}
                    onDelete={onDeletePost}
                    onEdit={onEditPost}
                />
            ))}
        </>
    );
};

export default PostFeedList;