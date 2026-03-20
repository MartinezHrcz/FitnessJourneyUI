import MainDashboardLayout from "../../layouts/user/MainDashboardLayout.tsx";
import type {user} from "../../types/User.ts";
import {User, Mail, Calendar, Ruler, Scale, ShieldCheck, Settings, Users2, Camera} from "lucide-react";
import {useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useTheme} from "../../hooks/useTheme.ts";
import {friendApi} from "../../api/friends/friendApi.ts";
import type {FriendDTO} from "../../types/social/Friend.ts";
import SettingsTab from "./components/UserSettings.tsx";
import TabButton from "./components/TabButton.tsx";
import FriendsList from "./components/FriendsList.tsx";
import {userApi} from "../../api/users/userApi.ts";
import UserAvatar from "../../components/UserAvatar.tsx";


const UserProfilePage = () => {
    const [user, setUser] = useState<user | null>(null);
    const [activeTab, setActiveTab] = useState<"profile" | "friends" | "settings">("profile");
    const [friends, setFriends] = useState<FriendDTO[]>([]);
    const [isUploadingPicture, setIsUploadingPicture] = useState(false);
    const [pictureError, setPictureError] = useState<string | null>(null);
    const profilePictureInputRef = useRef<HTMLInputElement | null>(null);
    const { isDark, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const MAX_PROFILE_IMAGE_SIZE = 5 * 1024 * 1024;

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const parsed = JSON.parse(storedUser);
            setUser(parsed);
            friendApi.getFriendsOfUser(parsed.id).then(res => setFriends(res.data.filter(f => f.status === 'ACCEPTED')));
        }
    }, []);

    if (!user) return <div className="p-8 text-center">Loading Profile...</div>;

    const bmi = (user.weightInKg / Math.pow(user.heightInCm / 100, 2)).toFixed(1);
    const age = new Date().getFullYear() - new Date(user.birthday).getFullYear();

    const handleProfilePictureClick = () => {
        if (isUploadingPicture) return;
        profilePictureInputRef.current?.click();
    };

    const handleProfilePictureChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        event.target.value = "";

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            setPictureError("Please choose a valid image file.");
            return;
        }

        if (file.size > MAX_PROFILE_IMAGE_SIZE) {
            setPictureError("Profile picture must be 5MB or smaller.");
            return;
        }

        try {
            setIsUploadingPicture(true);
            const res = await userApi.updateProfilePicture(file);
            setUser(res.data);
            localStorage.setItem("user", JSON.stringify(res.data));
            setPictureError(null);
        } catch (error) {
            console.error("Failed to upload profile picture", error);
            setPictureError("Failed to update profile picture. Please try again.");
        } finally {
            setIsUploadingPicture(false);
        }
    };

    return (
        <MainDashboardLayout user={user} title="My Profile" activePath="/profile">
            <div className="max-w-2xl mx-auto space-y-6 pb-20">
                <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
                    <TabButton active={activeTab === "profile"} onClick={() => setActiveTab("profile")} label="Profile" icon={<User size={18}/>} />
                    <TabButton active={activeTab === "friends"} onClick={() => setActiveTab("friends")} label="Friends" icon={<Users2 size={18}/>} />
                    <TabButton active={activeTab === "settings"} onClick={() => setActiveTab("settings")} label="Settings" icon={<Settings size={18}/>} />
                </div>

                <div className="min-h-[400px]">
                    {activeTab === "profile" && (
                        <ProfileTab
                            user={user}
                            bmi={bmi}
                            age={age}
                            onProfilePictureClick={handleProfilePictureClick}
                            onProfilePictureChange={handleProfilePictureChange}
                            profilePictureInputRef={profilePictureInputRef}
                            isUploadingPicture={isUploadingPicture}
                            pictureError={pictureError}
                        />
                    )}

                    {activeTab === "friends" && (
                        <FriendsList friends={friends} />
                    )}

                    {activeTab === "settings" && (
                        <SettingsTab
                            user={user}
                            setUser={setUser}
                            isDark={isDark}
                            toggleTheme={toggleTheme}
                        />
                    )}
                </div>

                <button onClick={() => { localStorage.clear(); navigate("/login"); }} className="w-full py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 font-bold rounded-2xl hover:text-red-600 transition-colors">
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

const ProfileTab = ({
    user,
    bmi,
    age,
    onProfilePictureClick,
    onProfilePictureChange,
    profilePictureInputRef,
    isUploadingPicture,
    pictureError
}: any) => (
    <div className="space-y-6 animate-in fade-in duration-300">
        <section className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-100 dark:border-slate-800 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-blue-500 to-blue-700" />
            <div className="relative pt-8">
                <button
                    type="button"
                    onClick={onProfilePictureClick}
                    className="relative w-28 h-28 bg-white dark:bg-slate-800 rounded-full mx-auto p-1 shadow-xl"
                    title="Update profile picture"
                >
                    <UserAvatar
                        name={user.name}
                        imageFilename={user.profilePictureUrl}
                        className="w-full h-full"
                        textClassName="text-4xl"
                        alt={`${user.name} profile picture`}
                    />
                    <span className="absolute bottom-0 right-0 bg-blue-600 text-white p-1.5 rounded-full shadow-md">
                        <Camera size={14} />
                    </span>
                </button>
                <input
                    ref={profilePictureInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={onProfilePictureChange}
                />
                {isUploadingPicture && (
                    <p className="mt-3 text-xs font-semibold text-blue-600 dark:text-blue-400">Uploading picture...</p>
                )}
                {pictureError && (
                    <p className="mt-3 text-xs font-semibold text-red-500">{pictureError}</p>
                )}
                <h1 className="mt-4 text-2xl font-black text-slate-800 dark:text-white">{user.name}</h1>
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-full text-[10px] font-bold uppercase tracking-widest mt-2">
                    <ShieldCheck size={12} /> {user.role}
                </span>
            </div>
        </section>

        <div className="grid grid-cols-3 gap-4">
            <MetricCard icon={<Scale size={18} className="text-orange-500"/>} label="Weight" value={`${user.weightInKg}kg`} />
            <MetricCard icon={<Ruler size={18} className="text-blue-500"/>} label="Height" value={`${user.heightInCm}cm`} />
            <MetricCard icon={<User size={18} className="text-green-500"/>} label="BMI" value={bmi} />
        </div>

        <section className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
            <div className="p-6 border-b border-slate-50 dark:border-slate-800">
                <h2 className="font-bold text-slate-800 dark:text-white">Personal Information</h2>
            </div>
            <div className="divide-y divide-slate-50 dark:divide-slate-800">
                <InfoRow icon={<Mail size={18}/>} label="Email Address" value={user.email} />
                <InfoRow icon={<Calendar size={18}/>} label="Birthday" value={`${new Date(user.birthday).toLocaleDateString()} (${age} years)`} />
            </div>
        </section>
    </div>
);
export default UserProfilePage;