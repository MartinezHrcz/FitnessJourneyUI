import {useEffect, useState} from "react";
import type {user} from "../../types/User.ts";
import MainDashboardLayout from "../../layouts/user/MainDashboardLayout.tsx";
import type {PostDto} from "../../types/social/Post.ts";
import {postApi} from "../../api/posts/postApi.ts";
import {Send, Image as ImageIcon, X} from "lucide-react";
import {PostCard} from "../../components/PostCard.tsx";

const UserMainPage:React.FC = () =>{

    const [user,setUser]=useState<user | null>(null);
    const [posts, setPosts] = useState<PostDto[]>([]);
    const [newPostContent, setNewPostContent] = useState("");
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedImage(file);

            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);

            e.target.value = "";
        }
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
                res = await postApi.createWithImage(newPostContent, selectedImage);
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
        <MainDashboardLayout user={user} title={"Dashboard"} activePath={"/dashboard"}  >
            <div className="max-w-2xl mx-auto py-4 px-2">
                <div className="bg-white rounded-3xl p-4 shadow-md border border-slate-100 mb-8">
                    <div className="flex gap-4">
                        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                            {user?.name.charAt(0).toUpperCase() || "U"}
                        </div>
                        <textarea
                            value={newPostContent}
                            onChange={(e) => setNewPostContent(e.target.value)}
                            placeholder={`What's on your mind, ${user?.name}?`}
                            className="w-full bg-slate-50 rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                            rows={3}
                        />
                    </div>
                    {previewUrl && (
                        <div className="relative w-full h-48 mt-2">
                            <img src={previewUrl} className="w-full h-full object-cover rounded-xl" />
                            <button
                                onClick={() => {setSelectedImage(null); setPreviewUrl(null);}}
                                className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full">
                                <X size={16} />
                            </button>
                        </div>
                    )}
                    <div className="flex justify-between items-center mt-3">
                        <label className="cursor-pointer text-slate-500 hover:text-blue-600 flex items-center gap-2">
                            <ImageIcon size={20} />
                            <span className="text-sm font-medium">Add Photo</span>
                            <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                        </label>
                        <button
                            onClick={handleCreatePost}
                            disabled={!newPostContent.trim()}
                            className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 disabled:opacity-50 transition-all shadow-lg shadow-blue-200">
                            <Send size={16} /> Post
                        </button>
                    </div>
                </div>

                <div className="space-y-2">
                    <h3 className="font-bold text-slate-800 text-lg mb-4">Recent Updates</h3>
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
                        <div className="text-center py-10 text-slate-400">
                            No posts yet. Start the conversation!
                        </div>
                    )}
                </div>
            </div>
        </MainDashboardLayout>
    );
}

export default UserMainPage;