import {type ReactNode } from "react";

interface MacroProps {
    label: string;
    value: number;
    unit: string;
    color: "blue" | "green" | "yellow";
    icon: ReactNode;
}

const colors = {
    blue: "bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/50",
    green: "bg-green-50 text-green-600 border-green-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/50",
    yellow: "bg-yellow-50 text-yellow-600 border-yellow-100 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/50",
};

export const MacroNutrientCard = ({ label, value, unit, color, icon }: MacroProps) => (
    <div className={`p-3 rounded-2xl border ${colors[color]} text-center`}>
        <div className="flex justify-center mb-1">{icon}</div>
        <p className="text-[9px] font-bold uppercase opacity-70 tracking-tighter leading-none mb-1">
            {label}
        </p>
        <p className="text-sm font-black">{value}{unit}</p>
    </div>
);