import {useEffect, useState} from "react";
import MainDashboardLayout from "../../layouts/user/MainDashboardLayout.tsx";
import {Bell, MessageCircle, Search, Trash2, UserCheck, UserPlus, Users} from "lucide-react";
import type {user} from "../../types/User.ts";
import {friendApi} from "../../api/friends/friendApi.ts";
import type {FriendDTO} from "../../types/social/Friend.ts";
import {userApi} from "../../api/users/userApi.ts";
import ChatModal from "../../components/ChatModal.tsx";
import UserAvatar from "../../components/UserAvatar.tsx";

const SocialHubPage = () => {
    const [activeTab, setActiveTab] = useState<'mine' | 'search' | 'requests'>('mine');
    const [search, setSearch] = useState('');
    const [user,setUser]=useState<user | null>(null);
    const [filteredUsers, setFilteredUsers] = useState<user[]>([]);
    const [friendships, setFriendships] = useState<FriendDTO[]>([]);
    const [badge, setBadge] = useState<number>(0);
    const [activeChatFriend, setActiveChatFriend] = useState<FriendDTO | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            fetchSocialData(parsedUser.id);
        }
    }, []);

    useEffect(() => {
        if (user?.id) {
            fetchSocialData(user.id);
        }
    }, [user?.id, activeTab]);

    const fetchSocialData = (userId: string) => {
        friendApi.getFriendsOfUser(userId).then((res) => {
            setFriendships(res.data);

            setBadge(res.data.filter(f=> f.status === 'IN_PROGRESS' && userId !== f.userId).length);
        });
    };

    const handleAddFriend = (targetId: string) => {
        if (!user) return;
        friendApi.create({ userId: user.id, friendId: targetId }).then(() => {
            setActiveTab('mine');
        });
    };

    const handleDeleteFriend = (friendshipId: string) => {
        if (!user) return;
        if (window.confirm("Are you sure you want to remove this friend?")) {
            friendApi.delete(friendshipId).then(() => {
                fetchSocialData(user.id);
            });
        }
    };

    const handleAcceptFriend = (friendshipId: string) => {
        if (!user) return;
        friendApi.acceptRequest(friendshipId).then(() => fetchSocialData(user?.id));
    }

    const renderList = () => {
        if (!Array.isArray(friendships)) return [];

        if (activeTab === 'search') {
            return filteredUsers.filter(f=> f.id !== user?.id
                && !friendships.map(u   => u.friendId).includes(f.id)
                && !friendships.map(u=> u.userId).includes(f.id)).map(u => (
                <SocialCard
                    key={u.id}
                    type="search"
                    name={u.name}
                    info={u.email}
                    imageFilename={u.profilePictureUrl}
                    onAction={() => handleAddFriend(u.id)}
                />
            ));
        }

        const filteredFriendships = friendships.filter(f => {
            if (activeTab === 'mine') return f.status === 'ACCEPTED';
            if (activeTab === 'requests') return (f.status === 'IN_PROGRESS' && f.userId !== user?.id);
            return false;
        });

        if (activeTab === 'requests') {
            return filteredFriendships.map(f => (
                <SocialCard
                    key={f.id}
                    type={activeTab}
                    name={f.friendName}
                    info={f.friendEmail}
                    imageFilename={f.friendProfilePicture}
                    onAction={() => handleAcceptFriend(f.id)}
                    onDelete={() => handleDeleteFriend(f.id)}
                />
            ));
        }

        return filteredFriendships.map(f => (
            <SocialCard
                key={f.id}
                type={activeTab}
                name={f.friendName}
                info={f.friendEmail}
                imageFilename={f.friendProfilePicture}
                onAction={() => setActiveChatFriend(f)}
                onDelete={() => handleDeleteFriend(f.id)}
            />
        ));
    };

    useEffect(() => {
        const delay = setTimeout(() => {
            userApi.getUserSearch({name: search})
                .then((response) => {
                    setFilteredUsers(response.data);
                })
                .catch((err) => {
                    console.error("Search failed:", err);
                });
        }, 400);

        return () => clearTimeout(delay);
    }, [search, activeTab]);


    return (
        <MainDashboardLayout user={user} title={'Social hub'} activePath={'/friends'}>
            <div className="w-full mx-auto flex flex-col lg-flex-row gap-8 p-4">
                <div className="flex-1 space-y-6">
                    <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl w-fit">
                        <TabButton
                            active={activeTab === 'mine'}
                            onClick={() => setActiveTab('mine')}
                            icon={<Users size={16} />}
                            label="My Friends"
                        />
                        <TabButton
                            active={activeTab === 'search'}
                            onClick={() => setActiveTab('search')}
                            icon={<Search size={16} />}
                            label="Find People"
                        />
                        <TabButton
                            active={activeTab === 'requests'}
                            onClick={() => setActiveTab('requests')}
                            icon={<Bell size={16} />}
                            label="Friend requests"
                            badge={badge}
                        />
                    </div>

                    <div className="space-y-4">
                        {activeTab === 'search' && (
                            <div className="relative mb-6">
                                <Search className="absolute left-4 top-4 text-slate-400" size={20} />
                                <input
                                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 pl-12 outline-none focus:ring-2 focus:ring-blue-500 shadow-sm dark:text-white transition-colors"                                    placeholder="Search by name or email..."
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {renderList()}
                            {renderList().length === 0 && (
                                <div className="col-span-full py-12 text-center text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-900/50 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl transition-colors">                                    No athletes found here yet.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <aside className="hidden lg:block w-80 space-y-6">
                    <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-3xl text-white shadow-lg shadow-blue-500/20">
                        <h3 className="font-bold text-lg mb-2">Community Stats</h3>
                        <div className="space-y-3 opacity-90">
                            <div className="flex justify-between text-sm">
                                <span>Global Rank</span>
                                <span className="font-bold">#1,240</span>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
            {activeChatFriend &&
                <ChatModal
                friend={activeChatFriend} onClose={() => setActiveChatFriend(null)} />
            }
        </MainDashboardLayout>
    );
}

const TabButton = ({active, onClick, icon, label, badge}: any) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
            active ? 
            "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm"
            : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
        }`}
    >
        {icon} {label}
        {badge > 0 && <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full ml-1">{badge}</span>}
    </button>
)

const SocialCard = ({type, name, info, imageFilename, onAction, onDelete}: any) => (
    <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between hover:shadow-md transition-all">
        <div className="flex items-center gap-4">
            <UserAvatar
                name={name}
                imageFilename={imageFilename}
                className="w-12 h-12"
                textClassName="text-lg"
            />

            <div>
                <p className="font-bold text-slate-800 dark:text-white transition-colors">{name}</p>
                <p className="text-xs text-slate-400 dark:text-slate-500">{info}</p>
            </div>
        </div>

        <div className="flex items-center gap-1">
            {type === 'mine' && (
                <>
                    <button
                        onClick={onAction}
                        className="p-2 text-slate-300 dark:text-slate-600 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                        title="Message"
                    >
                        <MessageCircle size={20}/>
                    </button>
                    <button
                        onClick={onDelete}
                        className="p-2 text-slate-300 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                        title="Remove Friend"
                    >
                        <Trash2 size={18} />
                    </button>
                </>
            )}

            {type === 'search' && (
                <button
                    onClick={onAction}
                    className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-colors"
                >
                    <UserPlus size={20}/>
                </button>
            )}

            {type === 'requests' && (
                <div className="flex gap-2">
                    <button
                        onClick={onAction}
                        className="p-2 bg-blue-600 dark:bg-blue-500 text-white rounded-xl hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                    >
                        <UserCheck size={18}/>
                    </button>
                    <button
                        onClick={onDelete}
                        className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 transition-colors"
                    >
                        <span className="text-xl leading-none">×</span>
                    </button>
                </div>
            )}
        </div>
    </div>
);

export default SocialHubPage;