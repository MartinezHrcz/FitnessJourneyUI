import { Scale, Ruler, User } from "lucide-react";
import MetricCard from "./MetricCard.tsx";

interface MetricGridProps {
    bmi: string;
    weight: number;
    height: number;
}

const MetricGrid = ({ bmi, weight, height }: MetricGridProps) => (
    <div className="grid grid-cols-3 gap-4">
        <MetricCard icon={<Scale size={18} className="text-orange-500"/>} label="Weight" value={`${weight}kg`} />
        <MetricCard icon={<Ruler size={18} className="text-blue-500"/>} label="Height" value={`${height}cm`} />
        <MetricCard icon={<User size={18} className="text-green-500"/>} label="BMI" value={bmi} />
    </div>
);

export default MetricGrid;
