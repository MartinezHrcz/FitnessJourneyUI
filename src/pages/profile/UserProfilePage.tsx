import MainDashboardLayout from "../../layouts/user/MainDashboardLayout.tsx";
import type {user} from "../../types/User.ts";
import { User, Mail, Calendar, Ruler, Scale, ShieldCheck } from "lucide-react";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";


const UserProfilePage = () => {

    const [user,setUser]=useState<user | null>(null);
    const navigate = useNavigate();

    useEffect(()=>{
        const storedUser = localStorage.getItem("user");
        if (storedUser){
            setUser(JSON.parse(storedUser) as user);
        }
    }, [])

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate("/login");
    }

    if (!user) return <div className="p-8 text-center">Loading Profile...</div>;

    const age = new Date().getFullYear() - new Date(user.birthday).getFullYear();

    const heightInMeters = user.heightInCm / 100;
    const bmi = (user.weightInKg / (heightInMeters * heightInMeters)).toFixed(1);

    return (
        <MainDashboardLayout user={user} title="My Profile" activePath="/profile">
            <div className="max-w-2xl mx-auto space-y-6 pb-20">

                <section className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-blue-500 to-blue-700" />

                    <div className="relative pt-8">
                        <div className="w-28 h-28 bg-white rounded-full mx-auto p-1 shadow-xl">
                            <div className="w-full h-full bg-slate-100 rounded-full flex items-center justify-center text-blue-600 text-4xl font-black">
                                {user.name.charAt(0)}
                            </div>
                        </div>
                        <h1 className="mt-4 text-2xl font-black text-slate-800">{user.name}</h1>
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-[10px] font-bold uppercase tracking-widest mt-2">
                            <ShieldCheck size={12} /> {user.role}
                        </span>
                    </div>
                </section>

                <div className="grid grid-cols-3 gap-4">
                    <MetricCard
                        icon={<Scale size={18} className="text-orange-500"/>}
                        label="Weight"
                        value={`${user.weightInKg} kg`}
                    />
                    <MetricCard
                        icon={<Ruler size={18} className="text-blue-500"/>}
                        label="Height"
                        value={`${user.heightInCm} cm`}
                    />
                    <MetricCard
                        icon={<User size={18} className="text-green-500"/>}
                        label="BMI"
                        value={bmi}
                    />
                </div>

                <section className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-6 border-b border-slate-50">
                        <h2 className="font-bold text-slate-800">Personal Information</h2>
                    </div>
                    <div className="divide-y divide-slate-50">
                        <InfoRow icon={<Mail size={18}/>} label="Email Address" value={user.email} />
                        <InfoRow
                            icon={<Calendar size={18}/>}
                            label="Birthday"
                            value={`${new Date(user.birthday).toLocaleDateString()} (${age} years)`}
                        />
                    </div>
                </section>

                <button
                    onClick={handleLogout}
                    className="w-full py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-red-50 hover:text-red-600 transition-colors">
                    Logout
                </button>
            </div>
        </MainDashboardLayout>
    );
};

const MetricCard = ({ icon, label, value }: any) => (
    <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm text-center">
        <div className="flex justify-center mb-2">{icon}</div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{label}</p>
        <p className="text-lg font-black text-slate-800">{value}</p>
    </div>
);

const InfoRow = ({ icon, label, value }: any) => (
    <div className="flex items-center gap-4 p-4">
        <div className="p-2 bg-slate-50 text-slate-400 rounded-xl">{icon}</div>
        <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-1">{label}</p>
            <p className="text-sm font-semibold text-slate-700">{value}</p>
        </div>
    </div>
);

export default UserProfilePage;