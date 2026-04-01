import { Camera } from "lucide-react";
import UserAvatar from "../../../components/UserAvatar.tsx";
import type { user } from "../../../types/User.ts";
import React from "react";

interface ProfileHeaderProps {
    user: user;
    onProfilePictureClick: () => void;
    onProfilePictureChange: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
    profilePictureInputRef: React.RefObject<HTMLInputElement | null>;
    isUploadingPicture: boolean;
    pictureError: string | null;
}

const ProfileHeader = ({
    user,
    onProfilePictureClick,
    onProfilePictureChange,
    profilePictureInputRef,
    isUploadingPicture,
    pictureError
}: ProfileHeaderProps) => (
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
        </div>
    </section>
);

export default ProfileHeader;
