import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { ChevronLeft, Utensils } from "lucide-react";
import MainDashboardLayout from "../../layouts/user/MainDashboardLayout.tsx";
import { calorieLogApi } from "../../api/diet/calorieLogApi.ts";
import type {CalorieLogDTO} from "../../types/diet/Diet.ts";
import { DailyCalorieSummary } from "./components/DailyCaloriesSummary.tsx";
import type {user} from "../../types/User.ts";

const DayDetailPage = () => {
    const { date } = useParams<{ date: string }>();
    const [log, setLog] = useState<CalorieLogDTO | null>(null);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<user | null>(null);

    useEffect(() => {
        if (date) {
            calorieLogApi.getDailyLog(date).then(res => {
                setLog(res.data);
                setLoading(false);
            });
        }
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, [date]);

    return (
        <MainDashboardLayout activePath="/calories" title="Daily Review" user={user}>
            <div className="space-y-6 pb-20">
                <div className="flex items-center gap-4">
                    <Link
                        to="/calories/history"
                        className="p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 hover:text-blue-500 transition-colors"
                    >
                        <ChevronLeft size={20} />
                    </Link>
                    <div>
                        <h2 className="text-xl font-bold text-slate-800 dark:text-white transition-colors">
                            {new Date(date!).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </h2>
                        <p className="text-xs text-slate-400 dark:text-slate-600 font-medium tracking-wide">Historical Record</p>
                    </div>
                </div>

                {log && (
                    <>
                        <DailyCalorieSummary
                            totalCalories={log.totalCalories}
                            goal={2500}
                            protein={log.totalProtein}
                            carbs={log.totalCarbs}
                            fats={log.totalFats}
                        />

                        <section>
                            <div className="flex items-center gap-2 mb-4 px-1">
                                <Utensils size={18} className="text-slate-400 dark:text-slate-500" />
                                <h2 className="font-bold text-slate-800 dark:text-slate-100 transition-colors">Foods Consumed</h2>
                            </div>

                            <div className="space-y-3">
                                {log.entries.map(entry => (
                                    <div
                                        key={entry.id}
                                        className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-50 dark:border-slate-800/50 flex justify-between items-center transition-all"
                                    >
                                        <div>
                                            <p className="font-bold text-slate-700 dark:text-slate-200 text-sm">{entry.foodName}</p>
                                            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium uppercase tracking-tighter">
                                                {entry.quantity} {entry.unit} • {entry.totalCalories} kcal
                                            </p>
                                        </div>
                                        <div className="text-[10px] font-bold text-slate-300 dark:text-slate-700 uppercase tracking-widest">
                                            Logged
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </>
                )}

                {loading && (
                    <div className="flex flex-col items-center justify-center py-20 animate-pulse">
                        <div className="w-12 h-12 bg-slate-200 dark:bg-slate-800 rounded-full mb-4" />
                        <p className="text-slate-400 dark:text-slate-600 text-sm font-bold">Retrieving data...</p>
                    </div>
                )}
            </div>
        </MainDashboardLayout>
    );
};

export default DayDetailPage;