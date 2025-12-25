import {useNavigate} from "react-router-dom";
import MainDashboardLayout from "../../layouts/user/MainDashboardLayout.tsx";
import {useEffect, useState} from "react";
import type {WorkoutDTO} from "../../types/fitness/Workout.ts";
import {workoutApi} from "../../api/workouts/workoutApi.ts";
import {ArrowLeft, Calendar, ChevronRight, Dumbbell, History} from "lucide-react";
import type {user} from "../../types/User.ts";

const WorkoutHistoryPage = () => {

    const navigate = useNavigate();
    const [history, setHistory] = useState<WorkoutDTO[]>([]);
    const [user, setUser] = useState<user | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);

            workoutApi.getByUserId(parsedUser.id).then(res => {
                const sorted = res.data.sort((a, b) =>
                    new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
                );
                setHistory(sorted);
            });
        }
    }, []);

    return (
        <MainDashboardLayout user={user} title={'Workout history'} activePath='/workouts'>
            <div className="max-w-2xl mx-auto p-4 pb-24">
                <button
                    onClick={() => navigate('/workouts')}
                    className="flex items-center gap-2 text-slate-400 hover:text-blue-500 mb-6 transition"
                >
                    <ArrowLeft size={18} />
                    <span className="text-sm font-bold uppercase tracking-wider">Back to Dashboard</span>
                </button>

                <div className="space-y-4">
                    {history.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
                            <History size={48} />
                            <p className="text-slate-400">No workouts recorded yet.</p>
                        </div>
                    ) : (
                        history.map((workout) => (
                            <div
                                key={workout.id}
                                onClick={() => navigate(`/workouts/session/${workout.id}`)}
                                className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:border-blue-200 hover:shadow-md transition-all cursor-pointer flex justify-between items-center"
                            >
                                <div className="flex gap-4 items-center">
                                    <div className={`p-3 rounded-xl 
                                    ${workout.status === 'ONGOING' ?  
                                        'bg-green-100 text-green-600' : (workout.status === 'FINISHED' ?
                                            'bg-blue-50 text-blue-500' : 'bg-yellow-50 text-yellow-500')}`}>
                                        <Dumbbell size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-800">{workout.name}</h3>
                                        <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                                            <span className="flex items-center gap-1">
                                                <Calendar size={12} /> {new Date(workout.startDate).toLocaleDateString()}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                {workout.exercises?.length || 0} Exercises
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <ChevronRight className="text-slate-300" size={20} />
                            </div>
                        ))
                    )}
                </div>
            </div>
        </MainDashboardLayout>
    )
}

export default WorkoutHistoryPage;