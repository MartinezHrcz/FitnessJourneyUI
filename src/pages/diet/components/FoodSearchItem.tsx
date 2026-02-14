import { Plus, CheckCircle2 } from "lucide-react";
import type {FoodItemDTO} from "../../../types/diet/Diet.ts";

interface Props {
    food: FoodItemDTO;
    onAdd: (id: string) => void;
}

export const FoodSearchItem = ({ food, onAdd }: Props) => (
    <button
        onClick={() => onAdd(food.id)}
        className="w-full text-left p-4 hover:bg-blue-50 rounded-2xl border border-transparent hover:border-blue-100 transition-all flex justify-between items-center group"
    >
        <div>
            <div className="flex items-center gap-2">
                <p className="font-bold text-slate-700">{food.name}</p>
                {food.isDefault && (
                    <span className="flex items-center gap-0.5 text-[9px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-black uppercase tracking-tighter">
                        <CheckCircle2 size={10} /> Verified
                    </span>
                )}
            </div>
            <p className="text-xs text-slate-400">
                {food.calories} kcal / {food.servingSize}{food.servingUnit}
            </p>
        </div>
        <Plus size={20} className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
);