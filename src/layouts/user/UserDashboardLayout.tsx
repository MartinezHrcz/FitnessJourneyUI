import type {ReactNode} from "react";

import {
    LayoutDashboard,
    Dumbbell,
    Users,
    Apple,
    BicepsFlexed,
    CircleUser,
    type LucideIcon
} from "lucide-react";

import type {user} from "../../types/User.ts";

interface NavItem {
    label: string;
    icon: LucideIcon;
    href: string;
}

const navItems: NavItem[] = [
    {label: "Dashboard", icon: LayoutDashboard , href: "/dashboard"},
    {label: "Workouts", icon: BicepsFlexed , href: "/workouts"},
    {label: "Calories", icon: Apple, href: "/calories"},
    {label: "Friends", icon: Users, href: "/friends"},
    {label: "My Profile", icon: CircleUser, href: "/profile"},
]

interface UserDashboardLayoutProps {
    children: ReactNode;
    activePath?: string;
    user: user | null;
}

const UserDashboardLayout : React.FC<UserDashboardLayoutProps> = ({children, activePath = "/dashboard", user}) => {
    return (
        <div className="flex h-screen bg-gray-100">
            <aside className="w-64 flex flex-col bg-white shadow-xl border-r border-gray-100 p-4">
                <h1 className="text-2xl font-bold mb-6 flex items-center gap-2 text-indigo-800">
                    <Dumbbell size={24}/>
                    Fitness Journey
                </h1>
                {navItems.map((item : NavItem) =>
                    {
                        const isActive = activePath === item.href;
                        return (
                            <a  key={item.label}
                                href={item.href}
                                className={`
                                    flex items-center gap-3 p-3 rounded-lg transition-colors duration-200 
                                    ${isActive
                                    ? 'bg-indigo-100 text-indigo-700 font-semibold'
                                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                }
                                `}>
                                <item.icon size={20} />
                                <span>{item.label}</span>
                            </a>
                            )

                    }
                )}
            </aside>

            <main className="flex-1 flex flex-col overflow-hidden">
                <header className="flex items-center justify-between p-4 bg-white shadow-sm z-10 border-b border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
                        Dashboard
                    </h2>
                    <div className="flex items-center gap-4">
                        Welcome back, <strong className="text-gray-900 font-semibold">{user?.name}</strong>
                        <img
                            src="https://placehold.co/300x300/indigo/white?text=User"
                            alt="profile"
                            className="w-10 h-10 rounded-full object-cover border-2 border-indigo-400 cursor-pointer transition-transform duration-200 hover:scale-105"
                        />
                    </div>
                </header>

                <div className="p-8 flex-1 overflow-y-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}

export default UserDashboardLayout;