import { UserPlus } from "lucide-react";
import type { FriendDTO } from "../../../types/social/Friend.ts";
import UserAvatar from "../../../components/UserAvatar.tsx";

interface FriendsListProps {
    friends: FriendDTO[];
    onFindMore: () => void;
}

const FriendsList = ({ friends, onFindMore }: FriendsListProps) => {
    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex items-center justify-between px-2">
                <h3 className="font-bold text-slate-800 dark:text-white">
                    Friends ({friends.length})
                </h3>
                <button
                    onClick={onFindMore}
                    className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider hover:underline flex items-center gap-1"
                >
                    <UserPlus size={12} /> Find More
                </button>
            </div>

            <div className="grid grid-cols-1 gap-3">
                {friends.length > 0 ? (
                    friends.map((f) => <FriendCard key={f.id} friend={f} />)
                ) : (
                    <div className="bg-slate-50 dark:bg-slate-800/50 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-3xl py-10 text-center">
                        <p className="text-slate-400 text-sm italic">No friends added yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const FriendCard = ({ friend }: { friend: FriendDTO }) => (
    <div className="bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center gap-4 hover:border-blue-200 dark:hover:border-blue-900/50 transition-colors group">
        <div className="group-hover:scale-110 transition-transform">
            <UserAvatar
                name={friend.friendName}
                imageFilename={friend.friendProfilePicture}
                className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20"
                textClassName="text-sm"
            />
        </div>
        <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-slate-800 dark:text-white truncate">
                {friend.friendName}
            </p>
            <p className="text-[10px] text-slate-400 uppercase font-bold truncate">
                {friend.friendEmail}
            </p>
        </div>
    </div>
);

export default FriendsList;