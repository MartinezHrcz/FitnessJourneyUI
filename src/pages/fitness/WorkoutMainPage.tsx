import MainDashboardLayout from "../../layouts/user/MainDashboardLayout.tsx";
import {useEffect, useState} from "react";
import type {user} from "../../types/User.ts";
import {BarChart3, Calendar, Flame, Play, Plus} from "lucide-react";
import FitnessHeatMap from "../../components/FitnessHeatMap.tsx";
import type {WorkoutCreateDTO, WorkoutDTO} from "../../types/fitness/Workout.ts";
import {workoutApi} from "../../api/workouts/workoutApi.ts";
import {useNavigate} from "react-router-dom";
import {workoutPlanApi} from "../../api/workouts/workoutPlanApi.ts";
import type {WorkoutPlanDTO} from "../../types/fitness/WorkoutPlan.ts";
import {Alert} from "../../components/AlertDialog.tsx";

const WorkoutMainPage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState<user | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState<Partial<WorkoutCreateDTO>>({
        name: "",
        description: ""
    });

    const [history, setHistory] = useState<WorkoutDTO[]>([]);
    const [ongoingWorkout, setOngoingWorkout] = useState<WorkoutDTO | null>(null);
    const [plans, setPlans] = useState<WorkoutPlanDTO[]>([]);
    const [error, setError] = useState<string | undefined>(undefined);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser) as user;
            setUser(parsedUser);

            workoutApi.getByUserId(parsedUser.id).then((res) => {
                const recent = res.data
                    .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
                setHistory(recent);
                setOngoingWorkout(recent.find(w => w.status === 'ONGOING') ?? null);
            });
        }
    }, []);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser) as user);
        }
    }, [])

    useEffect(() => {
        workoutPlanApi.getAvailable().then((res) => {
            setPlans(res.data);
        }).catch(err => console.error("Failed to load plans", err));
    }, [])

    const handleConfirmStart = async () => {
        if (!user) return;

        const createWorkoutRequest: WorkoutCreateDTO = {
            name: formData.name || `${user.name}'s Workout`,
            description: formData.description || "",
            userId: user.id
        };

        try {
            workoutApi.create(createWorkoutRequest).then((result) => {
                setIsModalOpen(false);
                navigate(`/workouts/session/${result.data}`);
            })
        } catch (err) {
            console.log(err);
            setError("Failed to create workout!.");
        }
    }

    const handleStartFromPlan = async (planId: string) => {
        try {
            const response = await workoutPlanApi.startWorkoutFromPlan(planId);
            const newWorkoutId = response.data;
            navigate(`/workouts/session/${newWorkoutId}`);
        } catch {
            setError("Failed to start workout!.");
        }
    };

    const transformHistoryToHeatMap = (workout: WorkoutDTO[]) => {
        const counts: { [key: string]: number } = {};
        workout.forEach((workout) => {
            const date = new Date(workout.startDate).toISOString().split("T")[0].replace(/-/g, '/');

            const totalSetsInWorkout = workout.exercises.reduce((sum, exercise) => {
                return sum + (exercise.sets ? exercise.sets.length : 0);
            }, 0);

            counts[date] = (counts[date] || 0) + totalSetsInWorkout;

        })

        return Object.keys(counts).map(date => ({
            date,
            count: counts[date]
        }));
    }

    const calculateSetsThisWeek = () => {
        const today = new Date();
        const startOfTheWeek = new Date(today);

        startOfTheWeek.setDate(today.getDate() - today.getDay());
        startOfTheWeek.setHours(0, 0, 0);

        return history.filter(w => new Date(w.startDate) >= startOfTheWeek && w.status === 'FINISHED')
            .reduce((total, workout) => {
                return total + workout.exercises.reduce((exSum, ex) => exSum + (ex.sets?.length || 0), 0);
            }, 0);
    }

    const calculateStreak = () => {
        if (history.length === 0) return 0;

        const workoutDates = Array.from(new Set(
            history.filter(w => w.status === 'FINISHED')
                .map(w => new Date(w.startDate).toDateString()).map(d => new Date(d))));

        if (workoutDates.length === 0) return 0;

        let streak = 0;
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0);

        const latestWorkout = workoutDates[0];
        const diffInDays = Math.floor((currentDate.getTime() - latestWorkout.getTime()) / (1000 * 3600 * 24));

        if (diffInDays > 1) return 0;

        for (let i = 0; i < workoutDates.length; i++) {
            const expectedDate = new Date(workoutDates[0]);

            expectedDate.setDate(expectedDate.getDate() - i);

            if (workoutDates.toString() === expectedDate.toDateString()) {
                streak++;
            } else {
                break;
            }
        }

        return streak;
    }

    return (
        <MainDashboardLayout user={user} activePath={"/workouts"} title={"Your fitness starts here!"}>

            <Alert
                message={error}
                type="error"
                onClose={() => setError(undefined)}
            />

            {isModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl p-6 border border-slate-100 dark:border-slate-800 transition-colors">
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">New Session</h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">What are we training today?</p>

                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase ml-1">Workout Name</label>
                                <input
                                    autoFocus
                                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition"
                                    placeholder="e.g: Push Day / Cardio"
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase ml-1">Notes / Description</label>
                                <textarea
                                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition h-24 resize-none"
                                    placeholder="Focus on slow eccentrics..."
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-8">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="flex-1 py-3 text-slate-500 dark:text-slate-400 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmStart}
                                className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-md hover:bg-blue-700 transition"
                            >
                                Start Session
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div>
                <button
                    onClick={() => {
                        if (ongoingWorkout) {
                            navigate(`/workouts/session/${ongoingWorkout.id}`);
                        } else {
                            setIsModalOpen(true);
                        }
                    }}
                    className={`w-full rounded-2xl p-6 flex flex-col items-center justify-center transition-all hover:scale-[0.98] shadow-lg mb-8 text-white ${
                        ongoingWorkout
                            ? "bg-green-600 dark:bg-green-500 hover:bg-green-700 dark:shadow-green-900/20"
                            : "bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:shadow-blue-900/20"
                    }`}
                >
                    {ongoingWorkout ? (
                        <>
                            <Play size={32} fill="currentColor" className="animate-pulse mb-2"/>
                            <span className="text-xl font-bold uppercase tracking-wide">Continue Workout</span>
                            <span className="text-[10px] opacity-80 font-medium italic mt-1">
                                Currently tracking: {ongoingWorkout.name}
                            </span>
                        </>
                    ) : (
                        <>
                            <Play size={32} fill="currentColor" className="mb-2"/>
                            <span className="text-xl font-bold uppercase tracking-wide">Start New Workout</span>
                        </>
                    )}
                </button>

                <section className="mt-8">
                    <div className="flex justify-between items-end mb-4 px-1">
                        <h2 className="font-bold text-slate-800 dark:text-white">Workout Plans</h2>
                        <button
                            onClick={() => navigate('/workouts/plans')}
                            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                        >
                            Manage Plans
                        </button>
                    </div>

                    <div className="relative">
                        <div className="absolute left-0 top-0 bottom-0 w-8 z-10 bg-gradient-to-r from-white dark:from-slate-950 to-transparent pointer-events-none" />
                            <div className="flex p-6 gap-4 overflow-x-auto pb-2 scrollbar-hide">
                                <div
                                    onClick={() => navigate('/workouts/plans/create')}
                                    className="min-w-[140px] h-32 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center text-slate-400 hover:border-blue-500 hover:text-blue-500 transition-all cursor-pointer"
                                >
                                    <Plus size={24} />
                                    <span className="text-xs font-bold mt-2">New Plan</span>
                                </div>

                                {plans.map(plan => (
                                    <div
                                        key={plan.id}
                                        onClick={() => handleStartFromPlan(plan.id)}
                                        className="min-w-[200px] h-32 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 flex flex-col justify-between shadow-sm hover:border-blue-500 transition-all cursor-pointer"
                                    >
                                        <div>
                                            <h3 className="font-bold text-slate-800 dark:text-white text-sm line-clamp-1">{plan.name}</h3>
                                            <p className="text-[10px] text-slate-400 mt-1">{plan.exercises.length} Exercises</p>
                                        </div>
                                        <button className="flex items-center gap-1 text-[10px] font-bold text-blue-600 uppercase">
                                            <Play size={10} fill="currentColor" /> Start Plan
                                        </button>
                                    </div>
                                ))}
                            </div>
                        <div className="absolute right-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-l from-white dark:from-slate-950 to-transparent pointer-events-none" />
                    </div>
                </section>

                <section className="mt-8">
                    <div className="flex justify-between items-end mb-4 px-1">
                        <h2 className="font-bold text-slate-800 dark:text-white">Recent Activity</h2>
                        <button
                            onClick={() => navigate('/workouts/history')}
                            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                        >
                            View All History
                        </button>
                    </div>

                    <div className="space-y-3 mb-8">
                        {history.slice(0, 3).map(workout => (
                            <div
                                key={workout.id}
                                onClick={() => navigate(`/workouts/session/${workout.id}`)}
                                className="bg-white/60 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 flex justify-between items-center cursor-pointer hover:border-blue-400 transition-colors"
                            >
                                <span className="font-bold text-slate-700 dark:text-white text-sm">{workout.name}</span>
                                <span className="text-xs text-slate-400 dark:text-slate-500">{new Date(workout.startDate).toLocaleDateString()}</span>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 mb-8 transition-colors">
                    <div className="flex items-center gap-2 mb-4 text-slate-600 dark:text-slate-400">
                        <Calendar size={20}/>
                        <h2 className="font-semibold">Consistency</h2>
                    </div>

                    <div className="w-full bg-slate-50 dark:bg-slate-950 rounded-xl flex items-center justify-center p-2 text-slate-400 border border-dashed border-slate-200 dark:border-slate-800">
                        <FitnessHeatMap data={transformHistoryToHeatMap(history)}/>
                    </div>
                </section>

                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-orange-100 dark:bg-orange-900/20 p-4 rounded-2xl border border-orange-200 dark:border-orange-900/30 transition hover:scale-105 duration-200">
                        <Flame className="text-orange-500 mb-1" size={24}/>
                        <p className="text-sm text-orange-800 dark:text-orange-300">Streak</p>
                        <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">{calculateStreak()} Days</p>
                    </div>
                    <div className="bg-blue-100 dark:bg-blue-900/20 p-4 rounded-2xl border border-blue-200 dark:border-blue-900/30 transition hover:scale-105 duration-200">
                        <BarChart3 className="text-blue-500 mb-1" size={24}/>
                        <p className="text-sm text-blue-800 dark:text-blue-300">This Week</p>
                        <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{calculateSetsThisWeek()} Sets</p>
                    </div>
                </div>
            </div>
        </MainDashboardLayout>
    );
}

export default WorkoutMainPage;