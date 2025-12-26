import {useEffect, useState} from "react";
import {Plus, Search, X} from "lucide-react";
import type {AbstractExerciseDTO} from "../types/fitness/Exercise.ts";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (exerciseId: string) => void;
    exercises: AbstractExerciseDTO[];
}

const AddExerciseModal = ({isOpen, onClose, onSelect, exercises}: Props) => {

    const[search, setSearch] = useState("");
    const[filteredExercises, setFilteredExercises] = useState<AbstractExerciseDTO[]>(exercises);
    
    useEffect(() => {
        if (search.trim().length < 0) {
            setFilteredExercises(exercises);
        }
        setFilteredExercises(exercises.filter(exercise => exercise.name.toLowerCase().includes(search.toLowerCase())));
    },[exercises, search])

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm min-h-screen">
            <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 min-h-full">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-slate-800">Add Exercise</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full">
                        <X size={20} className="text-slate-500"/>
                    </button>
                </div>

                <div className="p-4">
                    <div className="relative mb-4">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search exercises..."
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="max-h-[60vh] overflow-y-auto space-y-2 custom-scrollbar">
                    {filteredExercises.map((ex) => (
                        <button
                            key={ex.id}
                            onClick={() => {
                                onSelect(ex.id);
                                onClose();
                            }}
                            className="w-full flex items-center justify-between p-4 hover:bg-blue-50 rounded-2xl border border-transparent hover:border-blue-100 transition-all text-left group"
                        >
                            <div>
                                <p className="font-semibold text-slate-700">{ex.name}</p>
                                <p className="text-xs text-slate-400 uppercase tracking-wider">{ex.type}</p>
                            </div>
                            <div className="opacity-0 group-hover:opacity-100 transition text-blue-500">
                                <Plus size={20} />
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default AddExerciseModal;