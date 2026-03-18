import { useState } from "react";
import { Moon, Sun, Target, Save } from "lucide-react";
import { userApi } from "../../../api/users/userApi.ts";

const SettingsTab = ({ user, setUser, isDark, toggleTheme }: any) => {
    const [calories, setCalories] = useState(user.preferredCalories || "");
    const [loading, setLoading] = useState(false);

    const handleUpdateCalories = async () => {
        setLoading(true);
        try {
            const updateData = { ...user, preferredCalories: Number(calories) };
            const res = await userApi.updateUser(user.id, updateData);
            setUser(res.data);
            localStorage.setItem("user", JSON.stringify(res.data));
            alert("Settings updated!");
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            <section className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 p-6">
                <h2 className="font-bold text-slate-800 dark:text-white mb-4">Appearance</h2>
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-white dark:bg-slate-700 rounded-xl shadow-sm">
                            {isDark ? <Moon className="text-indigo-400" size={20}/> : <Sun className="text-amber-500" size={20}/>}
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-800 dark:text-white">Dark Mode</p>
                        </div>
                    </div>
                    <button onClick={toggleTheme} className={`w-12 h-6 rounded-full transition-colors relative ${isDark ? 'bg-blue-600' : 'bg-slate-300'}`}>
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isDark ? 'left-7' : 'left-1'}`} />
                    </button>
                </div>
            </section>

            <section className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 p-6">
                <h2 className="font-bold text-slate-800 dark:text-white mb-4">Health Goals</h2>
                <div className="space-y-4">
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase ml-2">Daily Calorie Target</label>
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <Target size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="number"
                                    value={calories}
                                    onChange={(e) => setCalories(e.target.value)}
                                    placeholder="e.g. 2500"
                                    className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-white"
                                />
                            </div>
                            <button
                                onClick={handleUpdateCalories}
                                disabled={loading}
                                className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-2xl transition-all disabled:opacity-50"
                            >
                                <Save size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default SettingsTab;