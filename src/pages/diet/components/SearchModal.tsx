import { Search, PlusCircle, X } from "lucide-react";
import { FoodSearchItem } from "./FoodSearchItem.tsx";
import type {FoodItemDTO} from "../../../types/diet/Diet.ts";

interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
    searchQuery: string;
    onSearch: (query: string) => void;
    results: FoodItemDTO[];
    onAdd: (id: string) => void;
    onCreateNew: () => void;
}

const STAPLES = ["Chicken", "Rice", "Egg", "Oats", "Banana", "Milk"];

export const SearchModal = ({
                                isOpen,
                                onClose,
                                searchQuery,
                                onSearch,
                                results,
                                onAdd,
                                onCreateNew
                            }: SearchModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 border border-slate-100 max-h-[80vh] flex flex-col relative">

                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-slate-800">Add Food</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="relative mb-4">
                    <Search className="absolute left-3 top-3 text-slate-400" size={20} />
                    <input
                        autoFocus
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 pl-10 outline-none focus:ring-2 focus:ring-blue-500 transition"
                        placeholder="Search foods (e.g. Chicken...)"
                        value={searchQuery}
                        onChange={(e) => onSearch(e.target.value)}
                    />
                </div>

                <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                    {searchQuery.length === 0 && (
                        <div className="mb-6">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 px-1">Common Staples</p>
                            <div className="flex flex-wrap gap-2">
                                {STAPLES.map(item => (
                                    <button
                                        key={item}
                                        onClick={() => onSearch(item)}
                                        className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold hover:bg-blue-100 hover:text-blue-600 transition"
                                    >
                                        + {item}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="space-y-1">
                        {results.map(food => (
                            <FoodSearchItem
                                key={food.id}
                                food={food}
                                onAdd={onAdd}
                            />
                        ))}
                    </div>

                    {(searchQuery.length > 0 && results.length === 0) && (
                        <div className="text-center py-6">
                            <p className="text-slate-400 text-sm mb-4">No results found for "{searchQuery}"</p>
                        </div>
                    )}

                    <button
                        onClick={onCreateNew}
                        className="w-full mt-4 p-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-500 hover:border-blue-400 hover:text-blue-500 transition-colors flex items-center justify-center gap-2 font-bold text-sm"
                    >
                        <PlusCircle size={18} /> Create custom food item
                    </button>
                </div>
            </div>
        </div>
    );
};