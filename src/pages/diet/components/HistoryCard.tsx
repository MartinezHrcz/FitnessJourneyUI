import { ChevronRight } from "lucide-react";
import type {CalorieLogDTO} from "../../../types/diet/Diet.ts";
import {useNavigate} from "react-router-dom";

interface Props {
    log: CalorieLogDTO;
    goal: number;
}

export const HistoryDayCard = ({ log, goal }: Props) => {
    const date = new Date(log.date);
    const navigate = useNavigate();
    const isOverGoal = log.totalCalories > goal;

    return (
        <div
            onClick={() => navigate(`/calories/day/${log.date}`)}
            className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between group hover:border-blue-200 dark:hover:border-blue-500/30 transition-all cursor-pointer shadow-sm"
        >
            <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center transition-colors
                    ${isOverGoal
                    ? 'bg-orange-50 dark:bg-red-900/30 text-orange-600 dark:text-orange-400'
                    : 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'}`}>
                    <span className="text-[10px] font-black uppercase leading-none">{date.toLocaleDateString('en-US', { month: 'short' })}</span>
                    <span className="text-lg font-bold leading-none">{date.getDate()}</span>
                </div>

                <div>
                    <h3 className="font-bold text-slate-700 dark:text-slate-200 text-sm">
                        {date.toLocaleDateString('en-US', { weekday: 'long' })}
                    </h3>
                    <div className="flex gap-3 mt-1">
                        <MacroIndicator label="P" value={log.totalProtein} color="bg-blue-400" />
                        <MacroIndicator label="C" value={log.totalCarbs} color="bg-emerald-400" />
                        <MacroIndicator label="F" value={log.totalFats} color="bg-amber-400" />
                    </div>
                </div>
            </div>

            <div className="text-right flex items-center gap-3">
                <div>
                    <p className="text-sm font-black text-slate-800 dark:text-white transition-colors">
                        {log.totalCalories} <span className="text-[10px] text-slate-400 dark:text-slate-600">kcal</span>
                    </p>
                    <p className={`text-[9px] font-bold uppercase italic tracking-tighter ${isOverGoal ? 'text-orange-500' : 'text-slate-300 dark:text-slate-600'}`}>
                        {isOverGoal ? 'Surplus' : 'On Target'}
                    </p>
                </div>
                <ChevronRight size={16} className="text-slate-300 dark:text-slate-700 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors" />
            </div>
        </div>
    );
};

const MacroIndicator = ({ label, value, color }: { label: string, value: number, color: string }) => (
    <div className="flex items-center gap-1">
        <div className={`w-1 h-1 rounded-full ${color}`} />
        <p className="text-[9px] font-bold text-slate-400">{value}{label}</p>
    </div>
);