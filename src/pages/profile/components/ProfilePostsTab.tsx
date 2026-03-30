import { useEffect, useState } from "react";
import { Alert } from "../../../components/AlertDialog.tsx";
import { postApi } from "../../../api/posts/postApi.ts";
import type { PostDto, PostVisibility } from "../../../types/social/Post.ts";
import PostComposer from "./PostComposer.tsx";
import PostEditForm from "./PostEditForm.tsx";
import PostFeedList from "./PostFeedList.tsx";

interface ProfilePostsTabProps {
    userName: string;
    userId: string;
    userProfilePicture?: string | null;
}

const ProfilePostsTab = ({
    userName,
    userId,
    userProfilePicture
}: ProfilePostsTabProps) => {
    const [posts, setPosts] = useState<PostDto[]>([]);
    const [newPostContent, setNewPostContent] = useState("");
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isFriendsOnly, setIsFriendsOnly] = useState(false);
    const [editingPost, setEditingPost] = useState<PostDto | null>(null);
    const [editPostContent, setEditPostContent] = useState("");
    const [editPostVisibility, setEditPostVisibility] = useState<PostVisibility>("GLOBAL");
    const [postError, setPostError] = useState<string | null>(null);
    const [postSuccess, setPostSuccess] = useState<string | null>(null);

    const MAX_POST_IMAGE_SIZE = 5 * 1024 * 1024;

    useEffect(() => {
        const loadUserPosts = async () => {
            try {
                const response = await postApi.getByUserId(userId);
                setPosts(response.data);
            } catch (error) {
                console.error("Failed to load user posts", error);
                setPostError("Failed to load your posts.");
            }
        };

        loadUserPosts();
    }, [userId]);

    const handlePostImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            setPostError("Please choose a valid image file.");
            event.target.value = "";
            return;
        }

        if (file.size > MAX_POST_IMAGE_SIZE) {
            setPostError("Post image must be 5MB or smaller.");
            event.target.value = "";
            return;
        }

        setSelectedImage(file);

        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);

        event.target.value = "";
    };

    const handleClearSelectedImage = () => {
        setSelectedImage(null);
        setPreviewUrl(null);
    };

    const handleCreatePost = async () => {
        if (!newPostContent.trim()) return;

        try {
            setPostError(null);
            let response;
            if (selectedImage) {
                const postData = JSON.stringify({
                    title: "New Post",
                    content: newPostContent,
                    userId,
                    visibility: isFriendsOnly ? "FRIENDS_ONLY" : "GLOBAL"
                });
                response = await postApi.createWithImage(postData, selectedImage);
            } else {
                response = await postApi.create({
                    title: "New Post",
                    content: newPostContent,
                    userId,
                    visibility: isFriendsOnly ? "FRIENDS_ONLY" : "GLOBAL"
                });
            }

            setPosts([response.data, ...posts]);
            setNewPostContent("");
            setSelectedImage(null);
            setPreviewUrl(null);
            setIsFriendsOnly(false);
            setPostSuccess("Post created successfully.");
        } catch (error) {
            console.error("Failed to create post", error);
            setPostError("Failed to create post.");
        }
    };

    const handleDeletePost = async (id: string) => {
        try {
            await postApi.delete(id);
            setPosts(posts.filter((post) => post.id !== id));
            setPostSuccess("Post deleted successfully.");
        } catch (error) {
            console.error("Failed to delete post", error);
            setPostError("Failed to delete post.");
        }
    };

    const handleStartEditPost = (post: PostDto) => {
        setEditingPost(post);
        setEditPostContent(post.content);
        setEditPostVisibility(post.visibility ?? "GLOBAL");
        setPostError(null);
    };

    const handleCancelEditPost = () => {
        setEditingPost(null);
        setEditPostContent("");
        setEditPostVisibility("GLOBAL");
    };

    const handleSaveEditPost = async () => {
        if (!editingPost || !editPostContent.trim()) return;

        try {
            const response = await postApi.update(editingPost.id, {
                title: editingPost.title,
                content: editPostContent,
                userId,
                visibility: editPostVisibility
            });

            setPosts(posts.map((post) => (post.id === editingPost.id ? response.data : post)));
            setEditingPost(null);
            setEditPostContent("");
            setEditPostVisibility("GLOBAL");
            setPostSuccess("Post updated successfully.");
        } catch (error) {
            console.error("Failed to update post", error);
            setPostError("Failed to update post.");
        }
    };

    return (
        <div className="space-y-6">
            <Alert message={postError ?? undefined} type="error" onClose={() => setPostError(null)} />
            <Alert message={postSuccess ?? undefined} type="success" onClose={() => setPostSuccess(null)} />

            <PostComposer
                userName={userName}
                userProfilePicture={userProfilePicture}
                newPostContent={newPostContent}
                previewUrl={previewUrl}
                isFriendsOnly={isFriendsOnly}
                onContentChange={setNewPostContent}
                onImageChange={handlePostImageChange}
                onClearImage={handleClearSelectedImage}
                onVisibilityChange={setIsFriendsOnly}
                onCreatePost={handleCreatePost}
            />

            {editingPost && (
                <PostEditForm
                    editPostContent={editPostContent}
                    editPostVisibility={editPostVisibility}
                    onContentChange={setEditPostContent}
                    onVisibilityChange={setEditPostVisibility}
                    onSave={handleSaveEditPost}
                    onCancel={handleCancelEditPost}
                />
            )}

            <PostFeedList
                posts={posts}
                currentUserId={userId}
                activeFeed="general"
                onDeletePost={handleDeletePost}
                onEditPost={handleStartEditPost}
            />
        </div>
    );
};

export default ProfilePostsTab;
