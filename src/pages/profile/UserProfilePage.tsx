import MainDashboardLayout from "../../layouts/user/MainDashboardLayout.tsx";
import type {user, updateUser} from "../../types/User.ts";
import {useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useTheme} from "../../hooks/useTheme.ts";
import {friendApi} from "../../api/friends/friendApi.ts";
import type {FriendDTO} from "../../types/social/Friend.ts";
import SettingsTab from "./components/UserSettings.tsx";
import FriendsList from "./components/FriendsList.tsx";
import ProfileTab from "./components/ProfileTab.tsx";
import {userApi} from "../../api/users/userApi.ts";
import ProfileTabsNav, {type ProfilePageTab} from "./components/ProfileTabsNav.tsx";
import ProfilePostsTab from "./components/ProfilePostsTab.tsx";


const UserProfilePage = () => {
    const [user, setUser] = useState<user | null>(null);
    const [activeTab, setActiveTab] = useState<ProfilePageTab>("profile");
    const [friends, setFriends] = useState<FriendDTO[]>([]);
    const [isUploadingPicture, setIsUploadingPicture] = useState(false);
    const [pictureError, setPictureError] = useState<string | null>(null);
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [editFormData, setEditFormData] = useState<Partial<user> | null>(null);
    const [isSavingProfile, setIsSavingProfile] = useState(false);
    const [profileError, setProfileError] = useState<string | null>(null);
    const profilePictureInputRef = useRef<HTMLInputElement | null>(null);
    const { isDark, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const MAX_PROFILE_IMAGE_SIZE = 5 * 1024 * 1024;

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const parsed = JSON.parse(storedUser);
            setUser(parsed);
            friendApi.getFriendsOfUser(parsed.id)
                .then((res) => {
                    const friendList = Array.isArray(res.data) ? res.data : [];
                    setFriends(friendList.filter((friend) => friend.status === "ACCEPTED"));
                })
                .catch(() => {
                    setFriends([]);
                });
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

    const handleEditProfile = () => {
        if (user) {
            setEditFormData(user);
            setIsEditingProfile(true);
            setProfileError(null);
        }
    };

    const handleCancelEdit = () => {
        setIsEditingProfile(false);
        setEditFormData(null);
        setProfileError(null);
    };

    const handleSaveProfile = async () => {
        if (!user || !editFormData) return;

        try {
            setIsSavingProfile(true);
            setProfileError(null);
            const res = await userApi.updateUser(user.id, editFormData as updateUser);
            setUser(res.data);
            localStorage.setItem("user", JSON.stringify(res.data));
            setIsEditingProfile(false);
            setEditFormData(null);
        } catch (error) {
            console.error("Failed to update profile", error);
            setProfileError("Failed to update profile. Please try again.");
        } finally {
            setIsSavingProfile(false);
        }
    };

    const handleEditFormChange = (field: keyof user, value: any) => {
        if (editFormData) {
            setEditFormData({
                ...editFormData,
                [field]: value
            });
        }
    };

    return (
        <MainDashboardLayout user={user} title="My Profile" activePath="/profile">
            <div className="max-w-2xl mx-auto space-y-6 pb-20">
                <ProfileTabsNav activeTab={activeTab} onTabChange={setActiveTab} />

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
                            isEditing={isEditingProfile}
                            editFormData={editFormData}
                            onEditProfile={handleEditProfile}
                            onCancelEdit={handleCancelEdit}
                            onSaveProfile={handleSaveProfile}
                            onEditFormChange={handleEditFormChange}
                            isSaving={isSavingProfile}
                            profileError={profileError}
                        />
                    )}

                    {activeTab === "friends" && (
                        <FriendsList friends={friends} />
                    )}

                    {activeTab === "posts" && (
                        <ProfilePostsTab
                            userName={user.name}
                            userId={user.id}
                            userProfilePicture={user.profilePictureUrl}
                        />
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

export default UserProfilePage;