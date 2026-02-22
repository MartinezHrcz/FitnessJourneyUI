import type {AbstractExerciseDTO} from "../types/fitness/Exercise.ts";
import defaultExerciseApi from "../api/exercises/defaultExerciseApi.ts";
import {exerciseApi} from '../api/exercises/exerciseApi.ts';
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import type {WorkoutDTO} from "../types/fitness/Workout.ts";
import {workoutApi} from "../api/workouts/workoutApi.ts";
import {CheckCircle, Clock, Dumbbell, Plus, Trash2, XCircle} from "lucide-react";
import AddExerciseModal from "./AddExerciseModal.tsx";
import * as React from "react";

interface ActiveWorkoutProps {
    workout: WorkoutDTO | null;
    setWorkout: React.Dispatch<React.SetStateAction<WorkoutDTO | null>>;
}

const ActiveWorkoutSession = ({workout, setWorkout}: ActiveWorkoutProps) =>{

    const navigate = useNavigate();
    const [exercises, setExercises] = useState<AbstractExerciseDTO[]>([]);
    const [seconds, setSeconds] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [syncedSetIds, setSyncedSetIds] = useState<number[]>([]);

    useEffect(() => {
        defaultExerciseApi.getAll().then(
            r => setExercises(r.data)
        )
    }, []);

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

    const handleFinishSession = () => {
        if (!workout) return;
        workoutApi.finishSession(workout.id).then(() => {
            navigate(`/workouts`)
        });
    }

    const handleAddExercise = (exerciseId: string) => {
        if (!workout) return;
        workoutApi.addDefaultExerciseToWorkout(workout.id, exerciseId)
            .then(r => setWorkout(r.data));
    }

    const handleRemoveExercise = (exerciseId: string) => {
        if (!workout) return;
        workoutApi.removeExerciseFromWorkout(workout.id, exerciseId).then(
            r => setWorkout(r.data));
    }

    const handleAddSet = (exerciseId: string, type: string) => {
        let newSet: any = {
            exerciseId,
            type: type,
        }

        if (type === 'CARDIO') {
            newSet = {...newSet, durationInSeconds: 0, distanceInKilometers: 0};
        } else if (type === 'FLEXIBILITY') {
            newSet = {...newSet, reps: 0}
        } else {
            newSet = {...newSet, reps: 0, weight: 0}
        }

        exerciseApi.addSet(exerciseId, newSet).then(response => {
            setWorkout(prev => {
                if (!prev) return null;
                return {
                    ...prev,
                    exercises: prev.exercises.map(ex =>
                        ex.id === exerciseId ? response.data : ex
                    )
                };
            });
        }).catch(err => console.error("Failed to add set:", err));
    }

    const renderSetInputs = (set: any) => {
        const inputClass = "bg-transparent outline-none border-b border-transparent focus:border-blue-400 w-16 px-1 dark:text-white transition-colors";
        const prefix = `set-${set.id}`;

        switch (set.type) {
            case 'CARDIO':
                return (
                    <>
                        <input id={`${prefix}-duration`}
                               type="number"
                               className={inputClass}
                               onChange={() => handleInputChange(set.id)}
                               defaultValue={set.durationInSeconds}/>
                        <input id={`${prefix}-distance`}
                               type="number"
                               className={inputClass}
                               onChange={() => handleInputChange(set.id)}
                               defaultValue={set.distanceInKilometers}/>
                    </>
                );
            case 'FLEXIBILITY':
                return (
                    <>
                        <input id={`${prefix}-reps`}
                               type="number"
                               className={inputClass}
                               placeholder="reps"
                               onChange={() => handleInputChange(set.id)}
                               defaultValue={set.reps}/>
                        <div/>
                    </>
                );
            default:
                return (
                    <>
                        <input id={`${prefix}-reps`}
                               type="number"
                               className={inputClass}
                               placeholder="kg"
                               onChange={() => handleInputChange(set.id)}
                               defaultValue={set.weight}/>
                        <input id={`${prefix}-weight`}
                               type="number"
                               className={inputClass}
                               placeholder="reps"
                               onChange={() => handleInputChange(set.id)}
                               defaultValue={set.reps}/>
                    </>
                );
        }
    };

    const handleRemoveSet = (exerciseId: string, setId: number) => {
        exerciseApi.removeSet(exerciseId, setId).then(response => {
            setWorkout(prev => {
                if (!prev) return null;
                return {
                    ...prev,
                    exercises: prev.exercises.map(ex =>
                        ex.id === exerciseId ? response.data : ex
                    )
                };
            });
        }).catch(err => console.error("Failed to remove set:", err));
    }

    const handleUpdateSet = (exerciseId: string, setId: number, updatedData: any) => {
        exerciseApi.updateSet(exerciseId, setId, updatedData)
            .then(response => {
                setWorkout(prev => {
                    if (!prev) return null;
                    return {
                        ...prev,
                        exercises: prev.exercises.map(ex =>
                            ex.id === exerciseId ? response.data : ex
                        )
                    };
                });
                setSyncedSetIds(prevState => [...prevState, setId]);
            })
            .catch(err => console.error("Failed to update set:", err));
    };

    const handleInputChange = (setId: number) => {
        setSyncedSetIds(prev => prev.filter(id => id !== setId));
    }

    const handleCancelSession = () => {
        if (!workout) return;
        workoutApi.cancelSession(workout?.id).then(
            () => {navigate('/workouts')}
        ).catch(err => console.error("Failed to cancel session:", err));
    }

    if (!workout) return <div className="p-8 text-center">Loading session...</div>;

    return(
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
            {isCancelModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl p-6 border border-slate-100 dark:border-slate-800">
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Cancel Session</h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Are you sure you want to cancel this session?</p>
                        <div className="flex gap-3 mt-8">
                            <button onClick={() => setIsCancelModalOpen(false)}
                                    className="flex-1 py-3 text-slate-500 dark:text-slate-400 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition">
                                Back
                            </button>
                            <button onClick={handleCancelSession}
                                    className="flex-1 py-3 bg-red-600 text-white font-bold rounded-xl shadow-md hover:bg-red-700 transition">
                                Cancel Session
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="pb-24">
                <header className="sticky top-0 z-40 w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 shadow-sm transition-colors">
                    <div className="max-w-2xl mx-auto flex items-center justify-between">
                        <div>
                            <h1 className="font-bold text-slate-800 dark:text-white">{workout.name}</h1>
                            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-mono text-xl">
                                <Clock size={24}/>
                                <h2>{formatTime(seconds)}</h2>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => setIsCancelModalOpen(true)}
                                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition">
                                <XCircle size={20}/>
                            </button>
                            <button onClick={() => handleFinishSession()}
                                    className="flex items-center gap-2 px-4 py-2 bg-green-500 dark:bg-green-600 text-white rounded-xl font-bold hover:bg-green-600 dark:hover:bg-green-700 transition shadow-md">
                                <CheckCircle size={18}/>
                                <span>Finish</span>
                            </button>
                        </div>
                    </div>
                </header>

                <main className="max-w-2xl mx-auto p-4 space-y-4 mt-4">
                    {workout.exercises === null || workout.exercises.length === 0 ? (
                        <div className="text-center py-20 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl text-slate-400 dark:text-slate-600">
                            <Dumbbell className="mx-auto mb-2 opacity-20" size={48}/>
                            <p>No exercises added yet.</p>
                        </div>
                    ) : workout.exercises.map((exercise) => (
                        <section key={exercise.id}
                                 className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 transition-all hover:shadow-md">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-3">
                                    <span className="p-2.5 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-2xl shadow-inner">
                                        <Dumbbell size={20}/>
                                    </span>
                                    <span className="text-lg">{exercise.name}</span>
                                </h3>
                                <button onClick={() => handleRemoveExercise(exercise.id)}
                                        className="p-2 text-slate-300 dark:text-slate-600 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all">
                                    <Trash2 size={18}/>
                                </button>
                            </div>

                            <div className="space-y-2">
                                <div className="grid grid-cols-4 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase px-2">
                                    <span>Set</span>
                                    {exercise.type === 'CARDIO' ? (
                                        <><span>Duration</span><span>Dist (km)</span></>
                                    ) : (
                                        <><span>{exercise.type === 'FLEXIBILITY' ? '' : 'Weight'}</span><span>Reps</span></>
                                    )}
                                    <span className="text-right">Action</span>
                                </div>

                                {exercise.sets?.map((set: any, index: number) => {
                                    const isSynced = syncedSetIds.includes(set.id);
                                    return (
                                        <div key={set.id}
                                             className={`grid grid-cols-4 items-center p-2 rounded-lg text-sm transition-all duration-300 ${
                                                 isSynced
                                                     ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800/50 scale-[1.02]"
                                                     : "bg-slate-50 dark:bg-slate-800/40 border-transparent dark:border-slate-800"
                                             }`}>
                                            <span className="font-bold text-slate-400 dark:text-slate-500">{index + 1}</span>
                                            {renderSetInputs(set)}
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => {
                                                        const prefix = `set-${set.id}`;
                                                        let data: any = {type: set.type, id: set.id};

                                                        if (set.type === 'CARDIO') {
                                                            data.durationInSeconds = Number((document.getElementById(`${prefix}-duration`) as HTMLInputElement).value);
                                                            data.distanceInKilometers = Number((document.getElementById(`${prefix}-distance`) as HTMLInputElement).value);
                                                        } else if (set.type === 'FLEXIBILITY') {
                                                            data.reps = Number((document.getElementById(`${prefix}-reps`) as HTMLInputElement).value);
                                                        } else {
                                                            data.weight = Number((document.getElementById(`${prefix}-weight`) as HTMLInputElement).value);
                                                            data.reps = Number((document.getElementById(`${prefix}-reps`) as HTMLInputElement).value);
                                                        }

                                                        handleUpdateSet(exercise.id, set.id, data);
                                                    }}
                                                    className="p-1 text-green-500 hover:bg-green-100 rounded transition"
                                                    title="Save Set"
                                                >
                                                    <CheckCircle size={18}/>
                                                </button>
                                                <button onClick={() => handleRemoveSet(exercise.id, set.id)}
                                                        className="text-slate-300 dark:text-slate-600 hover:text-red-500 transition-colors">
                                                    <Trash2 size={16}/>
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}

                                <button onClick={() => handleAddSet(exercise.id, exercise.type)}
                                        className="w-full py-2 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all uppercase">
                                    + Add Set
                                </button>
                            </div>
                        </section>
                    ))}

                    <button onClick={() => setIsModalOpen(true)}
                            className="w-full py-6 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-center gap-2 text-slate-400 dark:text-slate-500 hover:text-blue-500 dark:hover:text-blue-400 hover:border-blue-200 dark:hover:border-blue-800 transition-all bg-white/50 dark:bg-slate-900/30">
                        <Plus size={24}/>
                        <span className="font-bold uppercase tracking-wider text-sm">Add Exercise</span>
                    </button>
                </main>
            </div>
            <AddExerciseModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSelect={handleAddExercise}
                exercises={exercises || []}/>
        </div>
    );
 }


 export default ActiveWorkoutSession;