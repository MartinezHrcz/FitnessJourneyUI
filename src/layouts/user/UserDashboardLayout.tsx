import type {ReactNode} from "react";
import {Dumbbell, MenuIcon, Users, Apple, BicepsFlexed, CircleUser} from "lucide-react";

interface UserDashboardLayoutProps {
    children: ReactNode;
}

const UserDashboardLayout : React.FC<UserDashboardLayoutProps> = () => {
    return (
        <div className="flex h-screen bg-gray-100">
            <aside className="w-64 bg-white shadow-md p-4 flex-col">
                <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Dumbbell size={24}/>
                    Fitness Journey
                </h1>
                <nav className="flex items-center gap-2 p-2 hover:bg-gray-200 rounded">
                    <MenuIcon size={20} />
                    Dashboard
                </nav>
                <nav className="flex items-center gap-2 p-2 hover:bg-gray-200 rounded">
                    <BicepsFlexed size={20} />
                    Workouts
                </nav>
                <nav className="flex items-center gap-2 p-2 hover:bg-gray-200 rounded">
                    <Apple size={20} />
                    Calories
                </nav>
                <nav className="flex items-center gap-2 p-2 hover:bg-gray-200 rounded">
                    <Users size={20} />
                    Friends
                </nav>
                <nav className="flex items-center gap-2 p-2 hover:bg-gray-200 rounded">
                    <CircleUser size={20} />
                    My profile
                </nav>
            </aside>
        </div>
    );
}

export default UserDashboardLayout;