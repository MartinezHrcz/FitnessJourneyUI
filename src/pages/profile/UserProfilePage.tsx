import MainDashboardLayout from "../../layouts/user/MainDashboardLayout.tsx";
import type {user} from "../../types/User.ts";
import {User, Mail, Calendar, Ruler, Scale, ShieldCheck, Settings, Moon, Sun} from "lucide-react";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useTheme} from "../../hooks/useTheme.ts";
import {friendApi} from "../../api/friends/friendApi.ts";
import type {FriendDTO} from "../../types/social/Friend.ts";


const UserProfilePage = () => {

    const [user,setUser]=useState<user | null>(null);
    const [activeTab, setActiveTab] = useState<"profile" | "settings">("profile");
    const [friends, setFriends] = useState<FriendDTO[]>([]);
    const { isDark, toggleTheme } = useTheme();
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const parsed = JSON.parse(storedUser);
            setUser(parsed);
            friendApi.getFriendsOfUser(parsed.id).then(res => {
                setFriends(res.data.filter(f => f.status === 'ACCEPTED'));
            });
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate("/login");
    }

    if (!user) return <div className="p-8 text-center">Loading Profile...</div>;

    const age = new Date().getFullYear() - new Date(user.birthday).getFullYear();

    const heightInMeters = user.heightInCm / 100;
    const bmi = (user.weightInKg / (heightInMeters * heightInMeters)).toFixed(1);

    return (
        <MainDashboardLayout user={user} title="My Profile" activePath="/profile">
            <div className="max-w-2xl mx-auto space-y-6 pb-20">
                <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
                    <button
                        onClick={() => setActiveTab("profile")}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${activeTab === "profile" ? "bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400" : "text-slate-500"}`}
                    >
                        <User size={18} /> Profile
                    </button>
                    <button
                        onClick={() => setActiveTab("settings")}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${activeTab === "settings" ? "bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400" : "text-slate-500"}`}
                    >
                        <Settings size={18} /> Settings
                    </button>
                </div>

                {activeTab === "profile" ? (
                    <>
                        <section className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-100 dark:border-slate-800 text-center relative overflow-hidden transition-colors">
                            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-blue-500 to-blue-700" />
                            <div className="relative pt-8">
                                <div className="w-28 h-28 bg-white dark:bg-slate-800 rounded-full mx-auto p-1 shadow-xl transition-colors">
                                    <div className="w-full h-full bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center text-blue-600 text-4xl font-black transition-colors">
                                        {user.name.charAt(0)}
                                    </div>
                                </div>
                                <h1 className="mt-4 text-2xl font-black text-slate-800 dark:text-white">{user.name}</h1>
                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-full text-[10px] font-bold uppercase tracking-widest mt-2">
                                    <ShieldCheck size={12} /> {user.role}
                                </span>
                            </div>
                        </section>

                        <div className="grid grid-cols-3 gap-4">
                            <MetricCard icon={<Scale size={18} className="text-orange-500"/>} label="Weight" value={`${user.weightInKg} kg`} />
                            <MetricCard icon={<Ruler size={18} className="text-blue-500"/>} label="Height" value={`${user.heightInCm} cm`} />
                            <MetricCard icon={<User size={18} className="text-green-500"/>} label="BMI" value={bmi} />
                        </div>

                        <section className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden transition-colors">
                            <div className="p-6 border-b border-slate-50 dark:border-slate-800">
                                <h2 className="font-bold text-slate-800 dark:text-white">Personal Information</h2>
                            </div>
                            <div className="divide-y divide-slate-50 dark:divide-slate-800">
                                <InfoRow icon={<Mail size={18}/>} label="Email Address" value={user.email} />
                                <InfoRow icon={<Calendar size={18}/>} label="Birthday" value={`${new Date(user.birthday).toLocaleDateString()} (${age} years)`} />
                            </div>
                        </section>

                        <div className="space-y-4">
                            <h3 className="font-bold text-slate-800 dark:text-white px-2">Friends ({friends.length})</h3>
                            <div className="grid grid-cols-1 gap-3">
                                {friends.map(f => (
                                    <div key={f.id} className="bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center gap-4">
                                        <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center font-bold text-blue-600">
                                            {f.friendName.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-800 dark:text-white">{f.friendName}</p>
                                            <p className="text-[10px] text-slate-400 uppercase font-bold">{f.friendEmail}</p>
                                        </div>
                                    </div>
                                ))}
                                {friends.length === 0 && (
                                    <p className="text-center py-6 text-slate-400 text-sm italic">No friends added yet.</p>
                                )}
                            </div>
                        </div>
                    </>
                ) : (
                    <section className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden animate-in fade-in duration-300">
                        <div className="p-6 border-b border-slate-50 dark:border-slate-800">
                            <h2 className="font-bold text-slate-800 dark:text-white">Appearance Settings</h2>
                        </div>
                        <div className="p-4">
                            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-white dark:bg-slate-700 rounded-xl shadow-sm">
                                        {isDark ? <Moon className="text-indigo-400" size={20}/> : <Sun className="text-amber-500" size={20}/>}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-800 dark:text-white">Dark Mode</p>
                                        <p className="text-[10px] text-slate-400 uppercase font-bold">Switch between themes</p>
                                    </div>
                                </div>
                                <button
                                    onClick={toggleTheme}
                                    className={`w-12 h-6 rounded-full transition-colors relative ${isDark ? 'bg-blue-600' : 'bg-slate-300'}`}
                                >
                                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isDark ? 'left-7' : 'left-1'}`} />
                                </button>
                            </div>
                        </div>
                    </section>
                )}

                <button
                    onClick={handleLogout}
                    className="w-full py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-red-50 hover:text-red-600 transition-colors">
                    Logout
                </button>
            </div>
        </MainDashboardLayout>
    );
};

const MetricCard = ({ icon, label, value }: any) => (
    <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm text-center transition-colors">
        <div className="flex justify-center mb-2">{icon}</div>
        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tight">{label}</p>
        <p className="text-lg font-black text-slate-800 dark:text-white">{value}</p>
    </div>
);

const InfoRow = ({ icon, label, value }: any) => (
    <div className="flex items-center gap-4 p-4">
        <div className="p-2 bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 rounded-xl transition-colors">{icon}</div>
        <div>
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase leading-none mb-1">{label}</p>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{value}</p>
        </div>
    </div>
);
export default UserProfilePage;