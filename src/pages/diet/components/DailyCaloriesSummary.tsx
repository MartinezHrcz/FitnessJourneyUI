import { Flame, Beef, Wheat, Droplets } from "lucide-react";
import { MacroNutrientCard } from "./MacroNutrientCards.tsx";

interface DailySummaryProps {
    totalCalories: number;
    goal: number;
    protein: number;
    carbs: number;
    fats: number;
}

export const DailyCalorieSummary = ({
                                        totalCalories,
                                        goal,
                                        protein,
                                        carbs,
                                        fats
                                    }: DailySummaryProps) => {
    const calorieProgress = Math.min((totalCalories / goal) * 100, 100);

    return (
        <section className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors duration-300">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                        Total Intake
                    </p>
                    <h2 className="text-3xl font-black text-slate-800 dark:text-white">
                        {totalCalories}
                        <span className="text-lg font-bold text-slate-300 dark:text-slate-700 ml-1">
                            / {goal}
                        </span>
                    </h2>
                </div>
                <div className="p-3 bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 rounded-2xl transition-colors">
                    <Flame size={24} fill="currentColor" />
                </div>
            </div>

            <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-6">
                <div
                    className="h-full bg-orange-500 dark:bg-orange-600 shadow-[0_0_12px_rgba(249,115,22,0.4)] transition-all duration-1000 ease-out"
                    style={{ width: `${calorieProgress}%` }}
                />
            </div>

            <div className="grid grid-cols-3 gap-4">
                <MacroNutrientCard
                    label="Protein"
                    value={protein}
                    unit="g"
                    color="blue"
                    icon={<Beef size={14}/>}
                />
                <MacroNutrientCard
                    label="Carbs"
                    value={carbs}
                    unit="g"
                    color="green"
                    icon={<Wheat size={14}/>}
                />
                <MacroNutrientCard
                    label="Fats"
                    value={fats}
                    unit="g"
                    color="yellow"
                    icon={<Droplets size={14}/>}
                />
            </div>
        </section>
    );
};