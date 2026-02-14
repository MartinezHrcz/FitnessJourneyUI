import {type ReactNode } from "react";

interface MacroProps {
    label: string;
    value: number;
    unit: string;
    color: "blue" | "green" | "yellow";
    icon: ReactNode;
}

const colors = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    green: "bg-green-50 text-green-600 border-green-100",
    yellow: "bg-yellow-50 text-yellow-600 border-yellow-100",
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