import React from "react";
import type { user } from "../../../types/User.ts";
import ProfileHeader from "./ProfileHeader.tsx";
import MetricGrid from "./MetricGrid.tsx";
import PersonalInformation from "./PersonalInformation.tsx";
import EditProfileForm from "./EditProfileForm.tsx";

interface ProfileTabProps {
    user: user;
    bmi: string;
    age: number;
    onProfilePictureClick: () => void;
    onProfilePictureChange: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
    profilePictureInputRef: React.RefObject<HTMLInputElement>;
    isUploadingPicture: boolean;
    pictureError: string | null;
    isEditing: boolean;
    editFormData: Partial<user> | null;
    onEditProfile: () => void;
    onCancelEdit: () => void;
    onSaveProfile: () => Promise<void>;
    onEditFormChange: (field: keyof user, value: any) => void;
    isSaving: boolean;
    profileError: string | null;
}

const ProfileTab = ({
    user,
    bmi,
    age,
    onProfilePictureClick,
    onProfilePictureChange,
    profilePictureInputRef,
    isUploadingPicture,
    pictureError,
    isEditing,
    editFormData,
    onEditProfile,
    onCancelEdit,
    onSaveProfile,
    onEditFormChange,
    isSaving,
    profileError
}: ProfileTabProps) => {
    if (isEditing && editFormData) {
        return (
            <EditProfileForm
                editFormData={editFormData}
                onEditFormChange={onEditFormChange}
                onSaveProfile={onSaveProfile}
                onCancelEdit={onCancelEdit}
                isSaving={isSaving}
                profileError={profileError}
            />
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            <ProfileHeader
                user={user}
                onProfilePictureClick={onProfilePictureClick}
                onProfilePictureChange={onProfilePictureChange}
                profilePictureInputRef={profilePictureInputRef}
                isUploadingPicture={isUploadingPicture}
                pictureError={pictureError}
            />

            <MetricGrid
                bmi={bmi}
                weight={user.weightInKg}
                height={user.heightInCm}
            />

            <PersonalInformation
                user={user}
                age={age}
                onEditProfile={onEditProfile}
            />
        </div>
    );
};

export default ProfileTab;
