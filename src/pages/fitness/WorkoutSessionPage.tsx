import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import type {WorkoutDTO} from "../../types/fitness/Workout.ts";
import {workoutApi} from "../../api/workouts/workoutApi.ts";
import MainDashboardLayout from "../../layouts/user/MainDashboardLayout.tsx";
import {CheckCircle, Clock, Dumbbell, Plus, Trash2} from "lucide-react";
import type {user} from "../../types/User.ts";

const WorkoutSessionPage = () => {
    const {id} = useParams<{id:string}>();
    const navigate = useNavigate();
    const [workout, setWorkout] = useState<WorkoutDTO | null>(null);
    const [seconds, setSeconds] = useState(0);
    const [user,setUser]=useState<user | null>(null);

    useEffect(()=>{
        const storedUser = localStorage.getItem("user");
        if (storedUser){
            setUser(JSON.parse(storedUser) as user);
        }
    }, [])

    useEffect(() => {
        if (id) {
            workoutApi.getById(id).then((workout) => {
                setWorkout(workout.data)
            })
        }
    }, [id]);

    useEffect(() => {
        const interval = setInterval(() => setSeconds(s => s + 1), 1000);
        return () => clearInterval(interval);
    }, [])

    const formatTime = (totalSeconds: number) => {
        const hrs = Math.floor(totalSeconds / 3600);
        const mins = Math.floor((totalSeconds % 3600) / 60);
        const secs = totalSeconds % 60;
        return `${hrs > 0 ? hrs + ':' : ''}${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    if (!workout) return <div className="p-8 text-center">Loading session...</div>;

    return (
    <MainDashboardLayout user={user} title={"Workout"} activePath={"workouts"}>
        <div className="min-h-screen bg-slate-50 pb-24">
            <header className="sticky top-0 z-40 bg-white border-b border-slate-200 p-4 shadow-sm">
                <div className="max-w-2xl mx-auto flex items-center justify-between">
                    <div>
                        <h1 className="font-bold text-slate-800">{workout.name}</h1>
                        <div className="flex items-center gap-2 text-blue-600 font-mono text-xl">
                            <Clock size={24} />
                            <h2>{formatTime(seconds)}</h2>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => { if(window.confirm("Discard session?")) navigate("/workouts"); }}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                        >
                            <Trash2 size={20} />
                        </button>
                        <button
                            onClick={() => alert("placeholder")}
                            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 transition shadow-md"
                        >
                            <CheckCircle size={18} />
                            <span>Finish</span>
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-2xl mx-auto p-4 space-y-4 mt-4">
                {workout.exercises === null || workout.exercises.length === 0 ? <div className="text-center py-20 border-2 border-dashed border-slate-200 rounded-3xl text-slate-400">
                        <Dumbbell className="mx-auto mb-2 opacity-20" size={48} />
                        <p>No exercises added yet.</p>
                    </div> : workout.exercises.map((exercise) => (
                        <section key={exercise.id} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-slate-700 flex items-center gap-2">
                                    <span className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Dumbbell size={16}/></span>
                                    {exercise.name}
                                </h3>
                            </div>
                            <div className="space-y-2">
                                <div className="grid grid-cols-3 text-[10px] font-bold text-slate-400 uppercase px-2">
                                    <span>Set</span>
                                    <span>Weight</span>
                                    <span>Reps</span>
                                </div>
                                <div className="grid grid-cols-3 items-center bg-slate-50 p-2 rounded-lg text-sm">
                                    <span className="font-bold text-slate-400">1</span>
                                    <input type="number" className="bg-transparent outline-none border-b border-transparent focus:border-blue-400 w-16" placeholder="--" />
                                    <input type="number" className="bg-transparent outline-none border-b border-transparent focus:border-blue-400 w-16" placeholder="--" />
                                </div>
                            </div>
                        </section>
                    ))}

                <button
                    onClick={() => alert("Placeholder") }
                    className="w-full py-6 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center gap-2 text-slate-400 hover:text-blue-500 hover:border-blue-200 transition-all bg-white/50"
                >
                    <Plus size={24} />
                    <span className="font-bold uppercase tracking-wider text-sm">Add Exercise</span>
                </button>
            </main>
        </div>
    </MainDashboardLayout> )
}

export default WorkoutSessionPage;