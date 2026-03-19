import {useEffect, useState} from "react";
import type {user} from "../../types/User.ts";
import MainDashboardLayout from "../../layouts/user/MainDashboardLayout.tsx";
import type {PostDto} from "../../types/social/Post.ts";
import {postApi} from "../../api/posts/postApi.ts";
import {Alert} from "../../components/AlertDialog.tsx";
import PostComposer from "./components/PostComposer.tsx";
import PostFeedTabs, {type PostFeedType} from "./components/PostFeedTabs.tsx";
import PostFeedList from "./components/PostFeedList.tsx";

const UserMainPage:React.FC = () =>{

    const [user,setUser]=useState<user | null>(null);
    const [posts, setPosts] = useState<PostDto[]>([]);
    const [activeFeed, setActiveFeed] = useState<PostFeedType>("general");
    const [newPostContent, setNewPostContent] = useState("");
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const MAX_FILE_SIZE = 5 * 1024 * 1024;

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (!file) return;

        if (file.size > MAX_FILE_SIZE) {
            setError("This file is too large. Please upload an image smaller than 5MB.");
            e.target.value = "";
            return;
        }

        setSelectedImage(file);

        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);

        e.target.value = "";
    };

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) setUser(JSON.parse(storedUser) as user);
    }, []);

    useEffect(() => {
        fetchPosts(activeFeed);
    }, [activeFeed]);

    const fetchPosts = async (feed: PostFeedType) => {
        try {
            const res = feed === "friends"
                ? await postApi.getFriendsPosts()
                : await postApi.getAll();
            setPosts(res.data);
        } catch (err) {
            console.error("Failed to fetch posts", err);
        }
    };


    const handleCreatePost = async () => {
        if (!user || !newPostContent.trim()) return;
        try {
            let res;
            if (selectedImage) {
                const postData = JSON.stringify({
                    title: "New Post",
                    content: newPostContent,
                    userId: user.id
                });
                res = await postApi.createWithImage(postData, selectedImage);
            } else {
                res = await postApi.create({
                    userId: user.id,
                    title: "New Post",
                    content: newPostContent
                });
            }

            setPosts([res.data, ...posts]);
            setNewPostContent("");
            setSelectedImage(null);
            setPreviewUrl(null);
        } catch (err) {
            console.error("Error creating post", err);
        }
    };

    const handleDeletePost = async (id: string) => {
        try {
            await postApi.delete(id);
            setPosts(posts.filter(p => p.id !== id));
        } catch (err) {
            console.error("Error deleting post", err);
        }
    };

    return (
        <MainDashboardLayout user={user} title={"Dashboard"} activePath={"/dashboard"}>
            <div className="max-w-2xl mx-auto py-4 px-2">

                {error && (
                    <Alert
                        message={error}
                        type="error"
                        onClose={() => setError(null)}
                    />
                )}

                <PostComposer
                    userName={user?.name}
                    newPostContent={newPostContent}
                    previewUrl={previewUrl}
                    onContentChange={setNewPostContent}
                    onImageChange={handleImageChange}
                    onClearImage={() => {
                        setSelectedImage(null);
                        setPreviewUrl(null);
                    }}
                    onCreatePost={handleCreatePost}
                />

                <div className="space-y-4">
                    <PostFeedTabs
                        activeFeed={activeFeed}
                        onFeedChange={setActiveFeed}
                    />

                    <h3 className="font-bold text-slate-800 dark:text-white text-lg mb-4 ml-1">Recent Updates</h3>

                    <PostFeedList
                        posts={posts}
                        currentUserId={user?.id || ""}
                        activeFeed={activeFeed}
                        onDeletePost={handleDeletePost}
                    />
                </div>
            </div>
        </MainDashboardLayout>
    );
}

export default UserMainPage;