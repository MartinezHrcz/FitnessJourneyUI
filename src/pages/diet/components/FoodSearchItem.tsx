import { Plus, CheckCircle2 } from "lucide-react";
import type {FoodItemDTO} from "../../../types/diet/Diet.ts";

interface Props {
    food: FoodItemDTO;
    onAdd: (id: string) => void;
}

export const FoodSearchItem = ({ food, onAdd }: Props) => (
    <button
        onClick={() => onAdd(food.id)}
        className="w-full text-left p-4 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-2xl border border-transparent hover:border-blue-100 dark:hover:border-blue-800/50 transition-all flex justify-between items-center group"
    >
        <div>
            <div className="flex items-center gap-2">
                <p className="font-bold text-slate-700 dark:text-slate-200 transition-colors">
                    {food.name}
                </p>
                {food.isDefault && (
                    <span className="flex items-center gap-0.5 text-[9px] bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full font-black uppercase tracking-tighter">
                        <CheckCircle2 size={10} /> Verified
                    </span>
                )}
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500">
                {food.calories} <span className="opacity-70">kcal</span> / {food.servingSize}{food.servingUnit}
            </p>
        </div>

        <div className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-500 dark:text-blue-400 rounded-xl opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
            <Plus size={18} />
        </div>
    </button>
);