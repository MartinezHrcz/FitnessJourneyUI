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
import {Link} from "react-router-dom";
import UserAvatar from "../../components/UserAvatar.tsx";

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
    {label: "Friends", icon: Users, href: "/social"},
    {label: "My Profile", icon: CircleUser, href: "/profile"},
]

interface UserDashboardLayoutProps {
    children: ReactNode;
    activePath?: string;
    user: user | null;
    title: string;
    removePadding?: boolean;
}

const MainDashboardLayout : React.FC<UserDashboardLayoutProps> = ({children, activePath = "/dashboard", user, title, removePadding}) => {
    return (
        <div className="flex h-screen bg-gray-100 dark:bg-slate-950 transition-colors duration-300">

            <aside className="hidden lg:flex w-64 flex-col bg-white dark:bg-slate-900 shadow-xl border-r border-gray-100 dark:border-slate-800 p-4">
                <h1 className="text-2xl font-bold mb-6 flex items-center gap-2 text-indigo-800 dark:text-indigo-400">
                    <Dumbbell size={24} />
                    Fitness Journey
                </h1>
                <nav className="space-y-1">
                    {navItems.map((item) => {
                        const isActive = activePath === item.href;
                        return (
                            <Link key={item.label} to={item.href} className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${isActive ? 
                                'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-semibold' 
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800'}`}>
                                <item.icon size={20} />
                                <span>{item.label}</span>
                            </Link>
                        )
                    })}
                </nav>
            </aside>

            <main className="flex-1 flex flex-col overflow-hidden">
                <header className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 shadow-sm z-10 border-b border-gray-100 dark:border-slate-800 transition-colors">
                    <h2 className="lg:text-2xl max-md:text-m font-bold text-gray-800 dark:text-white tracking-tight">
                        {title}
                    </h2>

                    <Link to="/profile">
                        <div className="flex items-center gap-1 dark:text-gray-300">
                            <div className="hidden sm:block"> Welcome back,</div><strong className="text-gray-900 dark:text-white font-semibold">{user?.name}</strong>
                            <div className="border-2 border-indigo-400 rounded-full cursor-pointer transition-transform duration-200 hover:scale-105">
                                <UserAvatar
                                    name={user?.name}
                                    imageFilename={user?.profilePictureUrl}
                                    className="w-10 h-10"
                                    textClassName="text-sm"
                                />
                            </div>
                        </div>
                    </Link>
                </header>

                <div className={`${removePadding ? 'p-0' : 'p-6'} flex-1 overflow-y-auto bg-gray-100 dark:bg-slate-950 transition-colors`}>
                    {children}
                </div>
            </main>

            <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800 px-2 py-3 flex justify-around items-center z-50">
                {navItems.map((item) => {
                    const isActive = activePath === item.href;
                    return (
                        <Link key={item.label} to={item.href} className={`flex flex-col items-center gap-1 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400'}`}>
                            <item.icon size={22} />
                            <span className="text-[10px] font-medium">{item.label}</span>
                        </Link>
                    )
                })}
            </nav>
        </div>
    );
}

export default MainDashboardLayout;