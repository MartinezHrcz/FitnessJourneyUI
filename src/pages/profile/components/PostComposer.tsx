import {Image as ImageIcon, Send, X} from "lucide-react";
import UserAvatar from "../../../components/UserAvatar.tsx";

interface PostComposerProps {
    userName?: string;
    userProfilePicture?: string | null;
    newPostContent: string;
    previewUrl: string | null;
    isFriendsOnly: boolean;
    onContentChange: (value: string) => void;
    onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onClearImage: () => void;
    onVisibilityChange: (value: boolean) => void;
    onCreatePost: () => void;
}

const PostComposer = ({
    userName,
    userProfilePicture,
    newPostContent,
    previewUrl,
    isFriendsOnly,
    onContentChange,
    onImageChange,
    onClearImage,
    onVisibilityChange,
    onCreatePost
}: PostComposerProps) => {
    return (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 shadow-md border border-slate-100 dark:border-slate-800 mb-8 transition-colors">
            <div className="flex gap-4">
                <div className="shrink-0">
                    <UserAvatar
                        name={userName}
                        imageFilename={userProfilePicture}
                        className="w-12 h-12"
                        textClassName="text-lg"
                    />
                </div>

                <textarea
                    value={newPostContent}
                    onChange={(e) => onContentChange(e.target.value)}
                    placeholder={`What's on your mind, ${userName}?`}
                    className="w-full bg-slate-50 dark:bg-slate-800 rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:text-white dark:placeholder:text-slate-500 transition-all resize-none"
                    rows={3}
                />
            </div>

            {previewUrl && (
                <div className="relative w-full h-48 mt-4">
                    <img src={previewUrl} className="w-full h-full object-cover rounded-xl border dark:border-slate-700" alt="Preview" />
                    <button
                        onClick={onClearImage}
                        className="absolute top-2 right-2 p-1 bg-black/50 hover:bg-red-500 text-white rounded-full transition-colors">
                        <X size={16} />
                    </button>
                </div>
            )}

            <div className="flex justify-between items-center mt-3">
                <div className="flex items-center gap-4">
                    <label className="cursor-pointer text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-2 px-2 py-1 rounded-lg transition-colors">
                        <ImageIcon size={20} />
                        <span className="text-sm font-medium">Add Photo</span>
                        <input type="file" className="hidden" accept="image/*" onChange={onImageChange} />
                    </label>

                    <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 font-medium">
                        <input
                            type="checkbox"
                            checked={isFriendsOnly}
                            onChange={(e) => onVisibilityChange(e.target.checked)}
                            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                        Only friends
                    </label>
                </div>

                <button
                    onClick={onCreatePost}
                    disabled={!newPostContent.trim()}
                    className="bg-blue-600 dark:bg-blue-500 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50 transition-all shadow-lg shadow-blue-200 dark:shadow-none">
                    <Send size={16} /> Post
                </button>
            </div>
        </div>
    );
};

export default PostComposer;