import {useEffect, useState} from "react";
import MainDashboardLayout from "../../layouts/user/MainDashboardLayout.tsx";
import {Bell, Search, Users} from "lucide-react";
import {useNavigate} from "react-router-dom";
import type {user} from "../../types/User.ts";


const SocialHubPage = () => {
    const [activeTab, setActiveTab] = useState<'mine' | 'search' | 'requests'>('mine');
    const [search, setSearch] = useState('');
    const [user,setUser]=useState<user | null>(null);
    const navigate = useNavigate();

    useEffect(()=>{
        const storedUser = localStorage.getItem("user");
        if (storedUser){
            setUser(JSON.parse(storedUser) as user);
        }
    }, [])

    return (
        <MainDashboardLayout user={user} title={'Social hub'} activePath={'/friends'}>
            <div className="max-w-5xl mx-auto flex flex-col lg-flex-row gap-8 p-4">
                <div className="flex-1 space-y-6">
                    <div className="flex bg-slate-100 p-1.5 rounded-2xl w-fit">
                        <TabButton
                            active={activeTab === 'mine'}
                            onClick={() => setActiveTab('mine')}
                            icon={<Users size={16} />}
                            label="My Friends"
                        />
                        <TabButton
                            active={activeTab === 'search'}
                            onClick={() => setActiveTab('search')}
                            icon={<Search size={16} />}
                            label="Find People"
                        />
                        <TabButton
                            active={activeTab === 'requests'}
                            onClick={() => setActiveTab('requests')}
                            icon={<Bell size={16} />}
                            label="Friend requests"
                            badge={3}
                        />
                    </div>
                </div>
            </div>
        </MainDashboardLayout>
    );
}

const TabButton = ({active, onClick, icon, label, badge}: any) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
            active ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
        }`}
    >
        {icon} {label}
        {badge && <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full ml-1">{badge}</span>}
    </button>
)

export default SocialHubPage;