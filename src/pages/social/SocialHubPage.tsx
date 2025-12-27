import {useEffect, useState} from "react";
import MainDashboardLayout from "../../layouts/user/MainDashboardLayout.tsx";
import {Bell, MessageCircle, Search, UserCheck, UserPlus, Users} from "lucide-react";
import type {user} from "../../types/User.ts";
import {friendApi} from "../../api/friends/friendApi.ts";
import type {FriendDTO} from "../../types/social/Friend.ts";
import {userApi} from "../../api/users/userApi.ts";

const SocialHubPage = () => {
    const [activeTab, setActiveTab] = useState<'mine' | 'search' | 'requests'>('mine');
    const [search, setSearch] = useState('');
    const [user,setUser]=useState<user | null>(null);
    const [filteredUsers, setFilteredUsers] = useState<user[]>([]);
    const [friendships, setFriendships] = useState<FriendDTO[]>([]);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            fetchSocialData(parsedUser.id);
        }
    }, [activeTab]);

    const fetchSocialData = (userId: string) => {
        friendApi.getFriendsOfUser(userId).then((res) => {
            setFriendships(res.data);
        });
    };

    const handleAddFriend = (targetId: string) => {
        if (!user) return;
        friendApi.create({ userId: user.id, friendId: targetId }).then(() => {
            alert("Request sent!");
            setActiveTab('mine');
        });
    };

    const handleAcceptFriend = (friendshipId: string) => {
        friendApi.acceptRequest(friendshipId).then(() => {
            alert("Request accepted!");
        });
    }

    const renderList = () => {
        if (!Array.isArray(friendships)) return [];

        if (activeTab === 'search') {
            return filteredUsers.filter(f=> f.id !== user?.id).map(u => (
                <SocialCard
                    key={u.id}
                    type="search"
                    name={u.name}
                    info={u.email}
                    onAction={() => handleAddFriend(u.id)}
                />
            ));
        }

        const filteredFriendships = friendships.filter(f => {
            if (activeTab === 'mine') return f.status === 'ACCEPTED';
            if (activeTab === 'requests') return f.status === 'IN_PROGRESS';
            return false;
        });

        if (activeTab === 'requests') {
            return filteredFriendships.map(f => (
                <SocialCard
                    key={f.id}
                    type={activeTab}
                    name={f.friendName}
                    info={f.friendEmail}
                    onAction={() => handleAcceptFriend(f.id)}
                />
            ));
        }

        return filteredFriendships.map(f => (
            <SocialCard
                key={f.id}
                type={activeTab}
                name={f.friendName}
                info={f.friendEmail}
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
                    <div className="flex bg-slate-100 p-1.5 rounded-2xl w-fit">
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
                            badge={3}
                        />
                    </div>

                    <div className="space-y-4">
                        {activeTab === 'search' && (
                            <div className="relative mb-6">
                                <Search className="absolute left-4 top-4 text-slate-400" size={20} />
                                <input
                                    className="w-full bg-white border border-slate-200 rounded-2xl p-4 pl-12 outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                                    placeholder="Search by name or email..."
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {renderList()}
                            {renderList().length === 0 && (
                                <div className="col-span-full py-12 text-center text-slate-400 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl">
                                    No athletes found here yet.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <aside className="hidden lg:block w-80 space-y-6">
                    <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-3xl text-white shadow-lg">
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
        </MainDashboardLayout>
    );
}

const TabButton = ({active, onClick, icon, label, badge}: any) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
            active ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
        }`}
    >
        {icon} {label}
        {badge && <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full ml-1">{badge}</span>}
    </button>
)

const SocialCard = ({type, name, info, onAction}: any) => (
    <div className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center justify-between hover:shadow-md transition-shadow">
        <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center font-black text-slate-400">
                {name.charAt(0)}
            </div>
            <div>
                <p className="font-bold text-slate-800">{name}</p>
                <p className="text-xs text-slate-400">{info}</p>
            </div>
        </div>

        {type === 'mine' && <button className="p-2 text-slate-300 hover:text-blue-500"><MessageCircle size={20}/></button>}
        {type === 'search' && <button onClick={onAction} className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl"><UserPlus size={20}/></button>}
        {type === 'requests' && (
            <div className="flex gap-2">
                <button onClick={onAction} className="p-2 bg-blue-600 text-white rounded-xl"><UserCheck size={18}/></button>
                <button className="p-2 bg-slate-100 text-slate-400 rounded-xl">×</button>
            </div>
        )}
    </div>
);

export default SocialHubPage;