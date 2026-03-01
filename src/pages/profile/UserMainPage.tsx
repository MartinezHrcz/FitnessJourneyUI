import {useEffect, useState} from "react";
import type {user} from "../../types/User.ts";
import MainDashboardLayout from "../../layouts/user/MainDashboardLayout.tsx";
import type {PostDto} from "../../types/social/Post.ts";
import {postApi} from "../../api/posts/postApi.ts";
import {Send, Image as ImageIcon, X} from "lucide-react";
import {PostCard} from "../../components/PostCard.tsx";
import {Alert} from "../../components/AlertDialog.tsx";

const UserMainPage:React.FC = () =>{

    const [user,setUser]=useState<user | null>(null);
    const [posts, setPosts] = useState<PostDto[]>([]);
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
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const res = await postApi.getAll();
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

    useEffect(()=>{
        const storedUser = localStorage.getItem("user");
        if (storedUser){
            setUser(JSON.parse(storedUser) as user);
        }
    }, [])

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

                <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 shadow-md border border-slate-100 dark:border-slate-800 mb-8 transition-colors">
                    <div className="flex gap-4">
                        <div className="w-12 h-12 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center text-white font-bold shrink-0">
                            {user?.name.charAt(0).toUpperCase() || "U"}
                        </div>

                        <textarea
                            value={newPostContent}
                            onChange={(e) => setNewPostContent(e.target.value)}
                            placeholder={`What's on your mind, ${user?.name}?`}
                            className="w-full bg-slate-50 dark:bg-slate-800 rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:text-white dark:placeholder:text-slate-500 transition-all resize-none"
                            rows={3}
                        />
                    </div>

                    {previewUrl && (
                        <div className="relative w-full h-48 mt-4">
                            <img src={previewUrl} className="w-full h-full object-cover rounded-xl border dark:border-slate-700" alt="Preview" />
                            <button
                                onClick={() => {setSelectedImage(null); setPreviewUrl(null);}}
                                className="absolute top-2 right-2 p-1 bg-black/50 hover:bg-red-500 text-white rounded-full transition-colors">
                                <X size={16} />
                            </button>
                        </div>
                    )}

                    <div className="flex justify-between items-center mt-3">
                        <label className="cursor-pointer text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-2 px-2 py-1 rounded-lg transition-colors">
                            <ImageIcon size={20} />
                            <span className="text-sm font-medium">Add Photo</span>
                            <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                        </label>

                        <button
                            onClick={handleCreatePost}
                            disabled={!newPostContent.trim()}
                            className="bg-blue-600 dark:bg-blue-500 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50 transition-all shadow-lg shadow-blue-200 dark:shadow-none">
                            <Send size={16} /> Post
                        </button>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="font-bold text-slate-800 dark:text-white text-lg mb-4 ml-1">Recent Updates</h3>

                    {posts.length > 0 ? (
                        posts.map(post => (
                            <PostCard
                                key={post.id}
                                post={post}
                                currentUserId={user?.id || ""}
                                onDelete={handleDeletePost}
                            />
                        ))
                    ) : (
                        <div className="text-center py-16 text-slate-400 dark:text-slate-500 bg-slate-50/50 dark:bg-slate-900/20 rounded-3xl border-2 border-dashed border-slate-100 dark:border-slate-800">
                            No posts yet. Start the conversation!
                        </div>
                    )}
                </div>
            </div>
        </MainDashboardLayout>
    );
}

export default UserMainPage;