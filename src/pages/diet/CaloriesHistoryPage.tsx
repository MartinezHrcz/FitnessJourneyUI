import MainDashboardLayout from "../../layouts/user/MainDashboardLayout.tsx";
import { useEffect, useState } from "react";
import type { user } from "../../types/User.ts";
import {Calendar, History} from "lucide-react";
import { calorieLogApi } from "../../api/diet/calorieLogApi.ts";
import type { CalorieLogDTO } from "../../types/diet/Diet.ts";
import { CalorieHistoryChart } from "./components/CaloriesHistoryChart.tsx";
import { HistoryDayCard } from "./components/HistoryCard.tsx";
import {Link} from "react-router-dom";
import { getCalorieGoal } from "../../utils/calorieCalculator.ts";

const CaloriesHistoryPage = () => {
    const [user, setUser] = useState<user | null>(null);
    const [history, setHistory] = useState<CalorieLogDTO[]>([]);
    const calorieGoal = getCalorieGoal(user);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
            fetchHistory();
        }
    }, []);

    const fetchHistory = async () => {
        const res = await calorieLogApi.getHistoryLogs();
        const sorted = res.data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        setHistory(sorted);
    };

    const chartData = history.slice(-7).map(log => ({
        name: new Date(log.date).toLocaleDateString('en-US', { weekday: 'short' }),
        calories: log.totalCalories
    }));

    return (
        <MainDashboardLayout user={user} activePath="/calories" title="Caloric intake history">
            <div className="space-y-6 pb-20">

                <div className="flex justify-between items-end mb-4 px-1">
                    <div>
                        <h1 className="text-2xl font-black text-slate-800 dark:text-white transition-colors">History Overview</h1>
                        <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">{new Date().toDateString()}</p>
                    </div>
                    <Link
                        to="/calories"
                        className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 rounded-xl text-xs font-bold hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-all shadow-sm border border-slate-200/50 dark:border-slate-800"
                    >
                        <History size={14} />
                        Go Back
                    </Link>
                </div>

                <CalorieHistoryChart data={chartData} goal={calorieGoal} />

                <section className="space-y-4">
                    <div className="flex items-center gap-2 px-1">
                        <Calendar className="text-slate-400 dark:text-slate-600" size={18} />
                        <h2 className="font-bold text-slate-800 dark:text-slate-100 transition-colors">Timeline</h2>
                    </div>

                    <div className="space-y-3">
                        {history.length === 0 ? (
                            <div className="text-center py-12 bg-white dark:bg-slate-900/40 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
                                <p className="text-slate-400 dark:text-slate-600 text-sm italic">No history found yet.</p>
                            </div>
                        ) : (
                            [...history].reverse().map(log => (
                                <HistoryDayCard key={log.date} log={log} goal={calorieGoal} />
                            ))
                        )}
                    </div>
                </section>
            </div>
        </MainDashboardLayout>
    );
};

export default CaloriesHistoryPage;