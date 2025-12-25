import MainDashboardLayout from "../../layouts/user/MainDashboardLayout.tsx";
import {useEffect, useState} from "react";
import type {user} from "../../types/User.ts";
import {BarChart3, Calendar, Flame, Play} from "lucide-react";
import FitnessHeatMap from "../../components/FitnessHeatMap.tsx";
import type {WorkoutCreateDTO, WorkoutDTO} from "../../types/fitness/Workout.ts";
import {workoutApi} from "../../api/workouts/workoutApi.ts";
import {useNavigate} from "react-router-dom";

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
            alert("Error creating Workout!");
        }
    }

    const transformHistoryToHeatMap = (workout: WorkoutDTO[]) => {
        const counts: { [key:string] : number } = {};
        workout.forEach((workout) => {
            const date = new Date(workout.startDate).toISOString().split("T")[0].replace(/-/g, '/');
            counts[date] = (counts[date] || 0) + 1;
        })

        return Object.keys(counts).map(date => ({
            date,
            count: counts[date]
        }));
    }

    return (
        <MainDashboardLayout user={user} activePath={"/workouts"} title={"Your fitness starts here!"}>

            {isModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 border border-slate-100">
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">New Session</h2>
                        <p className="text-slate-500 text-sm mb-6">What are we training today?</p>

                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Workout
                                    Name</label>
                                <input
                                    autoFocus
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500 transition"
                                    placeholder="e.g: Push Day / Cardio"
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Notes /
                                    Description</label>
                                <textarea
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500 transition h-24 resize-none"
                                    placeholder="Focus on slow eccentrics..."
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-8">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="flex-1 py-3 text-slate-500 font-semibold hover:bg-slate-50 rounded-xl transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmStart}
                                className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-md hover:shadow-blue-200 hover:bg-blue-700 transition"
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
                    className={`w-full rounded-2xl p-4 flex flex-col items-center justify-center transition-all hover:scale-[0.98] shadow-lg mb-8 ${
                        ongoingWorkout
                            ? "bg-green-600 hover:bg-green-700 shadow-green-100"
                            : "bg-blue-600 hover:bg-blue-700 shadow-blue-100"
                    }`}
                >
                    {ongoingWorkout ? (
                        <>
                            <Play size={32} fill="currentColor" className="animate-pulse"/>
                            <span className="text-xl font-bold uppercase tracking-wide">Continue Workout</span>
                            <span className="text-[10px] opacity-80 font-medium italic mt-1">
                                Currently tracking: {ongoingWorkout.name}
                            </span>
                        </>
                    ) : (
                        <>
                            <Play size={32} fill="currentColor"/>
                            <span className="text-xl font-bold uppercase tracking-wide">Start New Workout</span>
                        </>
                    )}
                </button>
                <section className="mt-8">
                    <div className="flex justify-between items-end mb-4 px-1">
                        <h2 className="font-bold text-slate-800">Recent Activity</h2>
                        <button
                            onClick={() => navigate('/workouts/history')}
                            className="text-xs font-bold text-blue-600 hover:underline"
                        >
                            View All History
                        </button>
                    </div>

                    <div className="space-y-3 mb-2.5">
                        {history.slice(0, 3).map(workout => (
                            <div
                                key={workout.id}
                                onClick={() => navigate(`/workouts/session/${workout.id}`)}
                                className="bg-white/60 p-4 rounded-2xl border border-slate-100 flex justify-between items-center"
                            >
                                <span className="font-bold text-slate-700 text-sm">{workout.name}</span>
                                <span className="text-xs text-slate-400">{new Date(workout.startDate).toLocaleDateString()}</span>
                            </div>
                        ))}
                    </div>
                </section>
                <section className="bg-white p-4 rounded-xl shadow-sm border border-slate-100  mb-8">
                    <div className="flex items-center gap-2 mb-4 text-slate-600">
                        <Calendar size={20}/>
                        <h2 className="font-semibold">Consistency</h2>
                    </div>

                    <div
                        className="w-full bg-slate-50 rounded flex items-center justify-center text-slate-400 border border-dashed border-slate-200">
                        <FitnessHeatMap data={transformHistoryToHeatMap(history)} />
                    </div>
                </section>

                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div
                        className="bg-orange-200 p-4 rounded-xl border border-orange-100 transition hover:scale-105 duration-200">
                        <Flame className="text-orange-500 mb-1" size={24}/>
                        <p className="text-sm text-orange-800">Streak</p>
                        <p className="text-2xl font-bold text-orange-900">5 Days</p>
                    </div>
                    <div
                        className="bg-blue-200 p-4 rounded-xl border border-blue-100 transition hover:scale-105 duration-200">
                        <BarChart3 className="text-blue-500 mb-1" size={24}/>
                        <p className="text-sm text-blue-800">This Week</p>
                        <p className="text-2xl font-bold text-blue-900">42 Sets</p>
                    </div>
                </div>
            </div>
        </MainDashboardLayout>
    );
}

export default WorkoutMainPage;