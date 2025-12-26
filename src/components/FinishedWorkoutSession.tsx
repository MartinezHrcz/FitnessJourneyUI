import type {WorkoutDTO} from "../types/fitness/Workout.ts";
import {
    Book,
    Calendar,
    ChevronLeft,
    CircleMinus,
    Clock,
    Dumbbell,
    Trophy,
    XCircle
} from "lucide-react";
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import {workoutApi} from "../api/workouts/workoutApi.ts";

interface FinishedWorkoutProps {
    workout: WorkoutDTO;
}

const FinishedWorkoutSession = ( {workout} : FinishedWorkoutProps) => {

    const navigate = useNavigate();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

    const calculateDuration = () => {
        if (!workout.startDate || !workout.endDate) return "N/A";
        const start = new Date(workout.startDate).getTime();
        const end = new Date(workout.endDate).getTime();
        const diffInMins = Math.floor((end - start) / 60000);
        return `${diffInMins} min`;
    };

    const handleDeleteSession = () => {
        if (!workout.id) return;

        workoutApi.delete(workout.id).then(() => {
            navigate("/workouts/history");
        });
    }

    if (!workout) return <div className="p-8 text-center">Loading session...</div>;

    return (
        <div>
            {isDeleteModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 border border-slate-100">
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">Delete Session</h2>
                        <p className="text-slate-500 text-sm mb-6">Are you sure you want to delete this session?</p>
                        <div className="flex gap-3 mt-8">
                            <button
                                onClick={() => setIsDeleteModalOpen(false)}
                                className="flex-1 py-3 text-slate-500 font-semibold hover:bg-slate-50 rounded-xl transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteSession}
                                className="flex-1 py-3 bg-red-600 text-white font-bold rounded-xl shadow-md hover:shadow-red-200 hover:bg-red-700 transition"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <div className="min-h-screen bg-slate-50 pb-12">
                <header className="bg-white border-b border-slate-200 p-4 sticky top-0 z-40">
                    <div className="max-w-2xl mx-auto flex items-center gap-4 w-full">
                        <button onClick={() => navigate('/workouts/history')} className="p-2 hover:bg-slate-100 rounded-full transition">
                            <ChevronLeft size={24} className="text-slate-600" />
                        </button>
                        <div>
                            <h1 className="font-black text-xl text-slate-800">{workout.name}</h1>
                            <p className="text-slate-500 text-sm flex items-center gap-1">
                                <Calendar size={14} /> {new Date(workout.startDate).toLocaleDateString()}
                                <Book size={14}/> {workout.description}
                            </p>
                        </div>
                        <button
                            onClick={() => setIsDeleteModalOpen(true)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition ml-auto"
                        >
                            <CircleMinus size={20}/>
                        </button>
                    </div>

                </header>

                <main className="max-w-2xl mx-auto p-4 space-y-6 mt-4">
                    <div className="grid grid-cols-3 gap-3">
                        <StatCard icon={<Clock size={18}/>} label="Duration" value={calculateDuration()} color="blue" />
                        <StatCard icon={<Dumbbell size={18}/>} label="Exercises" value={workout.exercises?.length.toString()} color="purple" />
                        <StatCard icon={workout.status === 'FINISHED' ? <Trophy size={18}/> : <XCircle size={18} />} label="Status" value={workout.status} color={workout.status === 'FINISHED' ? "green" : 'yellow'} />
                    </div>

                    <div className="space-y-4">
                        {workout?.exercises.map((exercise) => (
                            <section key={exercise.id} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                                <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
                                    <span className="p-2 bg-slate-50 text-slate-500 rounded-xl"><Dumbbell size={18}/></span>
                                    {exercise.name}
                                </h3>

                                <div className="space-y-2">
                                    <div className="grid grid-cols-3 text-[10px] font-bold text-slate-400 uppercase px-4">
                                        <span>Set</span>
                                        <span>{exercise.type === 'CARDIO' ? 'Stats' : 'Weight'}</span>
                                        <span className="text-right">{exercise.type === 'CARDIO' ? '' : 'Reps'}</span>
                                    </div>

                                    {exercise.sets?.map((set: any, index: number) => (
                                        <div key={set.id} className="grid grid-cols-3 items-center bg-slate-50 p-3 rounded-2xl text-sm px-4">
                                            <span className="font-bold text-slate-400">{index + 1}</span>

                                            <span className="font-semibold text-slate-700">
                                                {set.type === 'CARDIO'
                                                    ? `${set.distanceInKilometers} km`
                                                    : `${set.weight} kg`}
                                            </span>

                                            <span className="text-right font-semibold text-slate-700">
                                                {set.type === 'CARDIO'
                                                    ? `${set.durationInSeconds}s`
                                                    : set.reps}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        ))}
                    </div>
                </main>
            </div>

            <div className="min-h-screen bg-slate-50 pb-12">
                <header className="bg-white border-b border-slate-200 p-4 sticky top-0 z-40">
                    <div className="max-w-2xl mx-auto flex items-center gap-4 w-full">
                        <button onClick={() => navigate('/workouts/history')} className="p-2 hover:bg-slate-100 rounded-full transition">
                            <ChevronLeft size={24} className="text-slate-600" />
                        </button>
                        <div>
                            <h1 className="font-black text-xl text-slate-800">{workout.name}</h1>
                            <p className="text-slate-500 text-sm flex items-center gap-1">
                                <Calendar size={14} /> {new Date(workout.startDate).toLocaleDateString()}
                                <Book size={14}/> {workout.description}
                            </p>
                        </div>
                        <button
                            onClick={() => setIsDeleteModalOpen(true)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition ml-auto"
                        >
                            <CircleMinus size={20}/>
                        </button>
                    </div>

                </header>

                <main className="max-w-2xl mx-auto p-4 space-y-6 mt-4">
                    <div className="grid grid-cols-3 gap-3">
                        <StatCard icon={<Clock size={18}/>} label="Duration" value={calculateDuration()} color="blue" />
                        <StatCard icon={<Dumbbell size={18}/>} label="Exercises" value={workout.exercises?.length.toString()} color="purple" />
                        <StatCard icon={workout.status === 'FINISHED' ? <Trophy size={18}/> : <XCircle size={18} />} label="Status" value={workout.status} color={workout.status === 'FINISHED' ? "green" : 'yellow'} />
                    </div>

                    <div className="space-y-4">
                        {workout?.exercises.map((exercise) => (
                            <section key={exercise.id} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                                <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
                                    <span className="p-2 bg-slate-50 text-slate-500 rounded-xl"><Dumbbell size={18}/></span>
                                    {exercise.name}
                                </h3>

                                <div className="space-y-2">
                                    <div className="grid grid-cols-3 text-[10px] font-bold text-slate-400 uppercase px-4">
                                        <span>Set</span>
                                        <span>{exercise.type === 'CARDIO' ? 'Stats' : 'Weight'}</span>
                                        <span className="text-right">{exercise.type === 'CARDIO' ? '' : 'Reps'}</span>
                                    </div>

                                    {exercise.sets?.map((set: any, index: number) => (
                                        <div key={set.id} className="grid grid-cols-3 items-center bg-slate-50 p-3 rounded-2xl text-sm px-4">
                                            <span className="font-bold text-slate-400">{index + 1}</span>

                                            <span className="font-semibold text-slate-700">
                                                {set.type === 'CARDIO'
                                                    ? `${set.distanceInKilometers} km`
                                                    : `${set.weight} kg`}
                                            </span>

                                            <span className="text-right font-semibold text-slate-700">
                                                {set.type === 'CARDIO'
                                                    ? `${set.durationInSeconds}s`
                                                    : set.reps}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        ))}
                    </div>
                </main>
            </div>
        </div>

    );
};

const StatCard = ({ icon, label, value, color }: any) => (
    <div className={`bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center text-center`}>
        <div className={`mb-1 text-${color}-500`}>{icon}</div>
        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-tighter">{label}</span>
        <span className="text-sm font-black text-slate-800">{value}</span>
    </div>
);


export default FinishedWorkoutSession;