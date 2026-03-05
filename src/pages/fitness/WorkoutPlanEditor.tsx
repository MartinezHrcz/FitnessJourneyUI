import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Trash2, Save, ArrowLeft, Dumbbell } from "lucide-react";
import { workoutPlanApi } from "../../api/workouts/workoutPlanApi.ts";
import { exerciseApi } from "../../api/exercises/exerciseApi.ts";
import MainDashboardLayout from "../../layouts/user/MainDashboardLayout.tsx";
import type {user} from "../../types/User.ts";
import type {PlanExerciseDTO} from "../../types/fitness/WorkoutPlan.ts";
import type {AbstractExerciseDTO} from "../../types/fitness/Exercise.ts";

const WorkoutPlanEditor = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [user, setUser] = useState<user | null>(null);
    const [name, setName] = useState("");
    const [description, setDescription] = useState<string | undefined>("");
    const [selectedExercises, setSelectedExercises] = useState<PlanExerciseDTO[]>([]);
    const [availableTemplates, setAvailableTemplates] = useState<AbstractExerciseDTO[]>([]);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) setUser(JSON.parse(storedUser));
    }, []);

    useEffect(() => {
        exerciseApi.getAll().then(res => setAvailableTemplates(res.data));

        if (id) {
            workoutPlanApi.getById(id).then(res => {
                setName(res.data.name);
                setDescription(res.data.description);
                setSelectedExercises(res.data.exercises);
            });
        }
    }, [id]);

    const addExercise = (template: AbstractExerciseDTO) => {
        setSelectedExercises([...selectedExercises, {
            id: template.id,
            exerciseTemplateId: template.id,
            name: template.name,
            targetSets: 3,
            type: template.type
        }]);
    };

    const removeExercise = (index: number) => {
        setSelectedExercises(selectedExercises.filter((_, i) => i !== index));
    };

    const updateSets = (index: number, sets: number) => {
        const newEx = [...selectedExercises];
        newEx[index].targetSets = Math.max(1, sets);
        setSelectedExercises(newEx);
    };

    const handleSave = async () => {
        setIsSaving(true);
        const payload = { name, description, exercises: selectedExercises };

        try {
            if (id) {
                //await workoutPlanApi.update(id, payload);
                //ToDo: I'll have to add this to api, also make dto for it... but it's 11'o clock so I'll just leave it as is for now
            } else {
                await workoutPlanApi.create(payload);
            }
            navigate("/workouts/plans");
        } catch (err) {
            console.log(err);
            alert("Failed to save plan.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <MainDashboardLayout user={user} title={id ? "Edit Plan" : "Create Plan"}>
            <div className="max-w-3xl mx-auto p-4 space-y-6">
                <div className="flex justify-between items-center">
                    <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 dark:hover:text-white transition">
                        <ArrowLeft size={20}/> Back
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving || !name}
                        className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 transition shadow-lg shadow-blue-500/20"
                    >
                        <Save size={18}/> {isSaving ? "Saving..." : "Save Plan"}
                    </button>
                </div>

                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
                    <input
                        className="text-2xl font-bold bg-transparent border-none outline-none w-full placeholder:text-slate-300 dark:text-white"
                        placeholder="Plan Name (e.g. Upper Body A)"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <textarea
                        className="w-full bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border-none outline-none resize-none text-slate-600 dark:text-slate-300"
                        placeholder="Short description or focus areas..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                <div className="space-y-3">
                    <h3 className="font-bold text-slate-800 dark:text-white px-1">Exercises</h3>
                    {selectedExercises.map((ex, index) => (
                        <div key={index} className="flex items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 group animate-in slide-in-from-left duration-200">
                            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600">
                                <Dumbbell size={20}/>
                            </div>
                            <div className="flex-1">
                                <p className="font-bold text-sm dark:text-white">{ex.name}</p>
                                <p className="text-[10px] text-slate-400 uppercase">{ex.type}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase">Sets</label>
                                <input
                                    type="number"
                                    className="w-12 bg-slate-100 dark:bg-slate-800 text-center rounded-lg font-bold p-1 dark:text-white"
                                    value={ex.targetSets}
                                    onChange={(e) => updateSets(index, parseInt(e.target.value))}
                                />
                            </div>
                            <button onClick={() => removeExercise(index)} className="p-2 text-slate-300 hover:text-red-500 transition">
                                <Trash2 size={18}/>
                            </button>
                        </div>
                    ))}

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4">
                        {availableTemplates.slice(0, 6).map(temp => (
                            <button
                                key={temp.id}
                                onClick={() => addExercise(temp)}
                                className="p-3 text-[11px] font-bold border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-slate-400 hover:border-blue-500 hover:text-blue-500 transition"
                            >
                                + {temp.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </MainDashboardLayout>
    );
};

export default WorkoutPlanEditor;