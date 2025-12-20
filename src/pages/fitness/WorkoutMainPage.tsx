import MainDashboardLayout from "../../layouts/user/MainDashboardLayout.tsx";
import {useEffect, useState} from "react";
import type {user} from "../../types/User.ts";
import {BarChart3, Calendar, Flame, Play} from "lucide-react";
import FitnessHeatMap from "../../components/FitnessHeatMap.tsx";

const WorkoutMainPage = () => {

    const [user, setUser] = useState<user | null>(null);

    useEffect(()=>{
        const storedUser = localStorage.getItem("user");
        if (storedUser){
            setUser(JSON.parse(storedUser) as user);
        }
    }, [])

    const handleStartWorkout = () =>{
        alert("starting!!!")
    }

    return (
        <MainDashboardLayout user={user} activePath={"/workouts"} title={"Your fitness starts here!"}>
            <div>
                <button
                    onClick={handleStartWorkout}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-2xl p-4 flex flex-col items-center justify-center transition-transform hover:scale-x-95 shadow-lg mb-8"
                >
                    <Play size={32} fill="currentColor" className="mb-2" />
                    <span className="text-2xl font-bold uppercase tracking-wide">Start New Workout</span>
                </button>

                <section className="bg-white p-4 rounded-xl shadow-sm border border-slate-100  mb-8">
                    <div className="flex items-center gap-2 mb-4 text-slate-600">
                        <Calendar size={20} />
                        <h2 className="font-semibold">Consistency</h2>
                    </div>

                    <div className="w-full bg-slate-50 rounded flex items-center justify-center text-slate-400 border border-dashed border-slate-200">
                        <FitnessHeatMap />
                    </div>
                </section>

                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-orange-200 p-4 rounded-xl border border-orange-100 transition hover:scale-105 duration-200">
                        <Flame className="text-orange-500 mb-1" size={24} />
                        <p className="text-sm text-orange-800">Streak</p>
                        <p className="text-2xl font-bold text-orange-900">5 Days</p>
                    </div>
                    <div className="bg-blue-200 p-4 rounded-xl border border-blue-100 transition hover:scale-105 duration-200">
                        <BarChart3 className="text-blue-500 mb-1" size={24} />
                        <p className="text-sm text-blue-800">This Week</p>
                        <p className="text-2xl font-bold text-blue-900">42 Sets</p>
                    </div>
                </div>
            </div>

        </MainDashboardLayout>
    );
}

export default WorkoutMainPage;