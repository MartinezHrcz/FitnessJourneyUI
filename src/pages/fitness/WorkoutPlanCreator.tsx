import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Save, ChevronLeft, Plus, Trash2 } from "lucide-react";
import AddExerciseModal from "../../components/AddExerciseModal"; // Your component
import { workoutPlanApi } from "../../api/workouts/workoutPlanApi";
import { exerciseApi } from "../../api/exercises/exerciseApi";
import type { AbstractExerciseDTO } from "../../types/fitness/Exercise";
import type { PlanExerciseRequestDTO } from "../../types/fitness/WorkoutPlan";
import defaultExerciseApi from "../../api/exercises/defaultExerciseApi.ts";
import {Alert} from "../../components/AlertDialog.tsx";

const WorkoutPlanCreator = () => {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [allExercises, setAllExercises] = useState<AbstractExerciseDTO[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedExercises, setSelectedExercises] = useState<PlanExerciseRequestDTO[]>([]);
    const [error, setError] = useState<string | undefined>(undefined);

    useEffect(() => {
        Promise.all([
            defaultExerciseApi.getAll(),
            exerciseApi.getAll()
        ])
            .then(([defaultRes, userRes]) => {
                const combined = [...defaultRes.data, ...userRes.data];
                setAllExercises(combined);
            })
            .catch(err => {
                console.log(err);
                setError("Failed to fetch allExercises");
            });
    }, []);

    const handleAddFromModal = (exerciseId: string) => {
        const alreadyExists = selectedExercises.find(ex => ex.exerciseTemplateId === exerciseId);
        if (alreadyExists) return;

        setSelectedExercises([...selectedExercises, {
            exerciseTemplateId: exerciseId,
            targetSets: 3
        }]);
    };

    const handleSave = async () => {
        if (!name.trim()){
            setError("Name cannot be empty!");
            return;
        }

        if (selectedExercises.length === 0) {
            setError("Please provide atleast 1 exercise");
            return;
        }

        try {
            await workoutPlanApi.create({
                name,
                description,
                exercises: selectedExercises
            });
            navigate("/workouts");
        } catch (err) {
            console.log(err);
            setError("Failed to create workout plan!");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-black p-4 pb-24 no-scrollbar">

            <AddExerciseModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                exercises={allExercises}
                onSelect={handleAddFromModal}
            />

            <Alert
                message={error}
                type = "warning"
                onClose={() => setError(undefined)}
            />

            <header className="flex items-center justify-between mb-8">
                <button onClick={() => navigate(-1)} className="p-3 bg-white dark:bg-slate-900 rounded-2xl shadow-sm">
                    <ChevronLeft size={20} className="dark:text-white"/>
                </button>
                <h1 className="text-xl font-bold dark:text-white">New Plan</h1>
                <button onClick={handleSave} className="bg-blue-600 text-white p-3 rounded-2xl shadow-lg shadow-blue-500/20 active:scale-95 transition">
                    <Save size={20} />
                </button>
            </header>

            <div className="space-y-6">
                <div className="space-y-3">
                    <input
                        className="w-full bg-white dark:bg-slate-900 p-4 rounded-2xl border-none outline-none font-bold text-xl dark:text-white placeholder:text-slate-300"
                        placeholder="Plan Name..."
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <textarea
                        className="w-full bg-white dark:bg-slate-900 p-4 rounded-2xl border-none outline-none text-sm dark:text-white h-24 resize-none placeholder:text-slate-400"
                        placeholder="Description (optional)..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                <div className="space-y-3">
                    <div className="flex justify-between items-center px-1">
                        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Exercises</h2>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="text-xs font-bold text-blue-600 flex items-center gap-1"
                        >
                            <Plus size={14}/> Add
                        </button>
                    </div>

                    {selectedExercises.map((ex, index) => {
                        const details = allExercises.find(a => a.id === ex.exerciseTemplateId);
                        return (
                            <div key={ex.exerciseTemplateId} className="bg-white dark:bg-slate-900 p-4 rounded-3xl flex items-center justify-between border border-slate-100 dark:border-slate-800 shadow-sm animate-in fade-in slide-in-from-right-2">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 font-bold text-sm">
                                        {index + 1}
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-800 dark:text-white text-sm">{details?.name || "Loading..."}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-[10px] text-slate-400 font-bold uppercase">Target:</span>
                                            <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg px-2 py-0.5">
                                                <input
                                                    type="number"
                                                    className="w-6 bg-transparent border-none outline-none text-[10px] font-bold dark:text-white text-center"
                                                    value={ex.targetSets}
                                                    onChange={(e) => {
                                                        const updated = [...selectedExercises];
                                                        updated[index].targetSets = parseInt(e.target.value) || 0;
                                                        setSelectedExercises(updated);
                                                    }}
                                                />
                                                <span className="text-[8px] text-slate-400 font-bold">SETS</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedExercises(selectedExercises.filter((_, i) => i !== index))}
                                    className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        );
                    })}

                    {selectedExercises.length === 0 && (
                        <div
                            onClick={() => setIsModalOpen(true)}
                            className="py-12 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl flex flex-col items-center justify-center text-slate-400 gap-2 cursor-pointer hover:border-blue-500 hover:text-blue-500 transition-all"
                        >
                            <Plus size={24} />
                            <p className="text-xs font-bold">Add your first exercise</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WorkoutPlanCreator;