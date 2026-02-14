import { ChevronRight } from "lucide-react";
import type {CalorieLogDTO} from "../../../types/diet/Diet.ts";

interface Props {
    log: CalorieLogDTO;
    goal: number;
}

export const HistoryDayCard = ({ log, goal }: Props) => {
    const date = new Date(log.date);

    return (
        <div className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center justify-between group hover:border-blue-200 transition-colors cursor-pointer">
            <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center ${log.totalCalories > goal ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'}`}>
                    <span className="text-[10px] font-black uppercase leading-none">{date.toLocaleDateString('en-US', { month: 'short' })}</span>
                    <span className="text-lg font-bold leading-none">{date.getDate()}</span>
                </div>
                <div>
                    <h3 className="font-bold text-slate-700 text-sm">{date.toLocaleDateString('en-US', { weekday: 'long' })}</h3>
                    <div className="flex gap-2 mt-0.5">
                        <MacroIndicator label="P" value={log.totalProtein} color="bg-blue-400" />
                        <MacroIndicator label="C" value={log.totalCarbs} color="bg-green-400" />
                        <MacroIndicator label="F" value={log.totalFats} color="bg-yellow-400" />
                    </div>
                </div>
            </div>
            <div className="text-right flex items-center gap-3">
                <div>
                    <p className="text-sm font-black text-slate-800">{log.totalCalories} <span className="text-[10px] text-slate-400">kcal</span></p>
                    <p className={`text-[9px] font-bold uppercase italic ${log.totalCalories > goal ? 'text-orange-500' : 'text-slate-300'}`}>
                        {log.totalCalories > goal ? 'Surplus' : 'On Target'}
                    </p>
                </div>
                <ChevronRight size={16} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
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