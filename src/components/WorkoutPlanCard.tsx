import { Play } from "lucide-react";
import type { WorkoutPlanDTO } from "../types/fitness/WorkoutPlan.ts";

interface PlanCardProps {
    plan: WorkoutPlanDTO;
    currentUserId?: string;
    onStart: (id: string) => void;
}

export const WorkoutPlanCard = ({ plan, currentUserId, onStart }: PlanCardProps) => {
    return (
        <div
            onClick={() => onStart(plan.id)}
            className="min-w-[200px] h-32 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 flex flex-col justify-between shadow-sm hover:border-blue-500 hover:shadow-md transition-all cursor-pointer group"
        >
            <div>
                <h3 className="font-bold text-slate-800 dark:text-white text-sm line-clamp-1 group-hover:text-blue-600 transition-colors">
                    {plan.name}
                </h3>
                <div className="flex justify-between items-center mt-1">
                    <p className="text-[10px] text-slate-400">{plan.exercises.length} Exercises</p>
                    {plan.creatorId === currentUserId && (
                        <span className="text-[8px] bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 px-1.5 py-0.5 rounded-md font-bold uppercase">
                            Personal
                        </span>
                    )}
                </div>
            </div>
            <button className="flex items-center gap-1 text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                <Play size={10} fill="currentColor" /> Start Plan
            </button>
        </div>
    );
};