import { FileText, Settings, User, Users2 } from "lucide-react";
import TabButton from "./TabButton.tsx";

export type ProfilePageTab = "profile" | "friends" | "posts" | "settings";

interface ProfileTabsNavProps {
    activeTab: ProfilePageTab;
    onTabChange: (tab: ProfilePageTab) => void;
}

const ProfileTabsNav = ({ activeTab, onTabChange }: ProfileTabsNavProps) => {
    return (
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
            <TabButton
                active={activeTab === "profile"}
                onClick={() => onTabChange("profile")}
                label="Profile"
                icon={<User size={18} />}
            />
            <TabButton
                active={activeTab === "friends"}
                onClick={() => onTabChange("friends")}
                label="Friends"
                icon={<Users2 size={18} />}
            />
            <TabButton
                active={activeTab === "posts"}
                onClick={() => onTabChange("posts")}
                label="Posts"
                icon={<FileText size={18} />}
            />
            <TabButton
                active={activeTab === "settings"}
                onClick={() => onTabChange("settings")}
                label="Settings"
                icon={<Settings size={18} />}
            />
        </div>
    );
};

export default ProfileTabsNav;
