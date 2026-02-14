import MainDashboardLayout from "../../layouts/user/MainDashboardLayout.tsx";
import { useEffect, useState } from "react";
import type { user } from "../../types/User.ts";
import {Calendar, History} from "lucide-react";
import { calorieLogApi } from "../../api/diet/calorieLogApi.ts";
import type { CalorieLogDTO } from "../../types/diet/Diet.ts";
import { CalorieHistoryChart } from "./components/CaloriesHistoryChart.tsx";
import { HistoryDayCard } from "./components/HistoryCard.tsx";
import {Link} from "react-router-dom";

const CaloriesHistoryPage = () => {
    const [user, setUser] = useState<user | null>(null);
    const [history, setHistory] = useState<CalorieLogDTO[]>([]);
    const calorieGoal = 2500;

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
                        <h1 className="text-2xl font-black text-slate-800">Today's date</h1>
                        <p className="text-xs text-slate-400 font-medium">{new Date().toDateString()}</p>
                    </div>
                    <Link
                        to="/calories"
                        className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold hover:bg-blue-50 hover:text-blue-600 transition-all shadow-sm border border-slate-200/50"
                    >
                        <History size={14} />
                        Go Back
                    </Link>
                </div>

                <CalorieHistoryChart data={chartData} goal={calorieGoal} />

                <section className="space-y-4">
                    <div className="flex items-center gap-2 px-1">
                        <Calendar className="text-slate-400" size={18} />
                        <h2 className="font-bold text-slate-800">Timeline</h2>
                    </div>

                    <div className="space-y-3">
                        {[...history].reverse().map(log => (
                        <HistoryDayCard key={log.date} log={log} goal={calorieGoal} />))}
                    </div>
                </section>
            </div>
        </MainDashboardLayout>
    );
};

export default CaloriesHistoryPage;