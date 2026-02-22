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
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-md transition-all duration-300">
            <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 sm:zoom-in duration-300 border border-transparent dark:border-slate-800">

                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center transition-colors">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white">Add Exercise</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                        <X size={20} className="text-slate-500 dark:text-slate-400"/>
                    </button>
                </div>

                <div className="p-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
                        <input
                            type="text"
                            placeholder="Search exercises..."
                            autoFocus
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="max-h-[60vh] overflow-y-auto space-y-1 px-2 pb-6 custom-scrollbar">
                    {filteredExercises.length > 0 ? (
                        filteredExercises.map((ex) => (
                            <button
                                key={ex.id}
                                onClick={() => {
                                    onSelect(ex.id);
                                    onClose();
                                    setSearch(""); // Reset search on select
                                }}
                                className="w-full flex items-center justify-between p-4 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-2xl border border-transparent hover:border-blue-100 dark:hover:border-blue-800/50 transition-all text-left group"
                            >
                                <div>
                                    <p className="font-semibold text-slate-700 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                        {ex.name}
                                    </p>
                                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest mt-0.5">
                                        {ex.type}
                                    </p>
                                </div>
                                <div className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:bg-blue-600 group-hover:text-white rounded-xl transition-all scale-90 group-hover:scale-100">
                                    <Plus size={18} />
                                </div>
                            </button>
                        ))
                    ) : (
                        <div className="py-12 text-center">
                            <p className="text-slate-400 dark:text-slate-600 text-sm italic">No exercises matching "{search}"</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AddExerciseModal;