import { Save, X } from "lucide-react";
import type { PostVisibility } from "../../../types/social/Post.ts";

interface PostEditFormProps {
    editPostContent: string;
    editPostVisibility: PostVisibility;
    onContentChange: (value: string) => void;
    onVisibilityChange: (value: PostVisibility) => void;
    onSave: () => void;
    onCancel: () => void;
}

const PostEditForm = ({
    editPostContent,
    editPostVisibility,
    onContentChange,
    onVisibilityChange,
    onSave,
    onCancel
}: PostEditFormProps) => {
    return (
        <section className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 space-y-4">
            <h2 className="font-bold text-slate-800 dark:text-white">Edit Post</h2>
            <textarea
                value={editPostContent}
                onChange={(e) => onContentChange(e.target.value)}
                rows={4}
                className="w-full bg-slate-50 dark:bg-slate-800 rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
            />
            <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 font-medium">
                <input
                    type="checkbox"
                    checked={editPostVisibility === "FRIENDS_ONLY"}
                    onChange={(e) => onVisibilityChange(e.target.checked ? "FRIENDS_ONLY" : "GLOBAL")}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                Only friends
            </label>
            <div className="flex gap-3">
                <button
                    onClick={onSave}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold"
                >
                    <Save size={16} /> Save
                </button>
                <button
                    onClick={onCancel}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-semibold"
                >
                    <X size={16} /> Cancel
                </button>
            </div>
        </section>
    );
};

export default PostEditForm;
