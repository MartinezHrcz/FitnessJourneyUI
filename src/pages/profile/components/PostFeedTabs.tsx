import {Globe, Users} from "lucide-react";
import TabButton from "./TabButton.tsx";

export type PostFeedType = "general" | "friends";

interface PostFeedTabsProps {
    activeFeed: PostFeedType;
    onFeedChange: (feed: PostFeedType) => void;
}

const PostFeedTabs = ({activeFeed, onFeedChange}: PostFeedTabsProps) => {
    return (
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl mb-4">
            <TabButton
                active={activeFeed === "general"}
                onClick={() => onFeedChange("general")}
                label="General Posts"
                icon={<Globe size={16} />}
            />
            <TabButton
                active={activeFeed === "friends"}
                onClick={() => onFeedChange("friends")}
                label="Friends Posts"
                icon={<Users size={16} />}
            />
        </div>
    );
};

export default PostFeedTabs;