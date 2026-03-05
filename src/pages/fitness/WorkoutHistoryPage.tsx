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
    const sortedHistory = [...history].sort((a, b) =>
        new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    );

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
                    className="flex items-center gap-2 text-slate-400 dark:text-slate-500 hover:text-blue-500 dark:hover:text-blue-400 mb-6 transition"
                >
                    <ArrowLeft size={18} />
                    <span className="text-sm font-bold uppercase tracking-wider">Back to Dashboard</span>
                </button>

                <div className="space-y-4">
                    {sortedHistory.length === 0 ? (
                        <div className="p-20 flex flex-col items-center bg-white dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 transition-colors">
                            <History size={48} className="text-slate-300 dark:text-slate-700 mb-4" />
                            <h2 className="text-slate-400 dark:text-slate-500 text-center font-medium">No workouts recorded yet.</h2>
                        </div>
                    ) : (
                        sortedHistory.map((workout) => (
                            <div
                                key={workout.id}
                                onClick={() => navigate(`/workouts/session/${workout.id}`)}
                                className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:border-blue-200 dark:hover:border-blue-500/50 hover:shadow-md transition-all cursor-pointer flex justify-between items-center"
                            >
                                <div className="flex gap-4 items-center">
                                    <div className={`p-3 rounded-xl transition-colors 
                                        ${workout.status === 'ONGOING' ?
                                        'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : (workout.status === 'FINISHED' ?
                                            'bg-blue-50 dark:bg-blue-900/30 text-blue-500 dark:text-blue-400' :
                                            'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-500 dark:text-yellow-400')}`}>
                                        <Dumbbell size={24} />
                                    </div>

                                    <div>
                                        <h3 className="font-bold text-slate-800 dark:text-slate-100">{workout.name}</h3>
                                        <div className="flex items-center gap-3 text-xs text-slate-400 dark:text-slate-500 mt-1">
                                                <span className="flex items-center gap-1">
                                                    <Calendar size={12} /> {new Date(workout.startDate).toLocaleDateString()}
                                                </span>
                                            <span className="flex items-center gap-1">
                                                    {workout.exercises?.length || 0} Exercises
                                                </span>
                                        </div>
                                    </div>
                                </div>
                                <ChevronRight className="text-slate-300 dark:text-slate-600" size={20} />
                            </div>
                        ))
                    )}
                </div>
            </div>
        </MainDashboardLayout>
    )
}

export default WorkoutHistoryPage;