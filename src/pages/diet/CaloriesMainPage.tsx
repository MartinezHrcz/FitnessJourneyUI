import MainDashboardLayout from "../../layouts/user/MainDashboardLayout.tsx";
import { useEffect, useState } from "react";
import type { user } from "../../types/User.ts";
import { Utensils, Plus, Search, Trash2, Flame, Wheat, Beef, Droplets } from "lucide-react";
import { calorieLogApi } from "../../api/diet/calorieLogApi.ts";
import { foodItemApi } from "../../api/diet/dietApi.ts";
import type { CalorieLogDTO, FoodItemDTO } from "../../types/diet/Diet.ts";

const CaloriesMainPage = () => {
    const [user, setUser] = useState<user | null>(null);
    const [dailyLog, setDailyLog] = useState<CalorieLogDTO | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<FoodItemDTO[]>([]);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const today = new Date().toISOString().split('T')[0];

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser) as user;
            setUser(parsedUser);
            fetchDailyLog(today);
        }
    }, []);

    const fetchDailyLog = async (date: string) => {
        const res = await calorieLogApi.getDailyLog(date);
        setDailyLog(res.data);
    };

    const handleSearch = async (query: string) => {
        setSearchQuery(query);
        if (query.length > 2) {
            const res = await foodItemApi.searchFoods(query);
            setSearchResults(res.data);
        } else {
            setSearchResults([]);
        }
    };

    const addMeal = async (foodId: string) => {
        if (!user) return;
        await calorieLogApi.addMealToLog(today, {
            foodItemId: foodId,
            quantity: 1
        });
        setIsSearchOpen(false);
        setSearchQuery("");
        fetchDailyLog(today);
    };

    const removeMeal = async (entryId: string) => {
        if (!user) return;
        await calorieLogApi.removeMealFromLog(today, entryId);
        fetchDailyLog(today);
    };

    const calorieGoal = 2500;
    const calorieProgress = Math.min(((dailyLog?.totalCalories || 0) / calorieGoal) * 100, 100);

    return (
        <MainDashboardLayout user={user} activePath="/calories" title="Fuel your journey">

            {isSearchOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 border border-slate-100 max-h-[80vh] flex flex-col">
                        <h2 className="text-2xl font-bold text-slate-800 mb-4">Add Food</h2>
                        <div className="relative mb-4">
                            <Search className="absolute left-3 top-3 text-slate-400" size={20} />
                            <input
                                autoFocus
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 pl-10 outline-none focus:ring-2 focus:ring-blue-500 transition"
                                placeholder="Search for food (e.g. Chicken, Rice...)"
                                value={searchQuery}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-2 pr-2">
                            {searchResults.map(food => (
                                <button
                                    key={food.id}
                                    onClick={() => addMeal(food.id)}
                                    className="w-full text-left p-4 hover:bg-blue-50 rounded-2xl border border-transparent hover:border-blue-100 transition-all flex justify-between items-center group"
                                >
                                    <div>
                                        <p className="font-bold text-slate-700">{food.name}</p>
                                        <p className="text-xs text-slate-400">{food.calories} kcal / {food.servingSize}{food.servingUnit}</p>
                                    </div>
                                    <Plus size={20} className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </button>
                            ))}
                        </div>

                        <button onClick={() => setIsSearchOpen(false)} className="mt-4 py-3 text-slate-500 font-semibold w-full">Close</button>
                    </div>
                </div>
            )}

            <div className="space-y-6 pb-20">
                <section className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Daily Calories</p>
                            <h2 className="text-3xl font-black text-slate-800">{dailyLog?.totalCalories || 0} <span className="text-lg font-bold text-slate-300">/ {calorieGoal}</span></h2>
                        </div>
                        <div className="p-3 bg-orange-100 text-orange-600 rounded-2xl">
                            <Flame size={24} fill="currentColor" />
                        </div>
                    </div>

                    <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden mb-6">
                        <div
                            className="h-full bg-orange-500 transition-all duration-1000 ease-out"
                            style={{ width: `${calorieProgress}%` }}
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <MacroMiniCard label="Protein" value={dailyLog?.totalProtein || 0} unit="g" color="blue" icon={<Beef size={14}/>} />
                        <MacroMiniCard label="Carbs" value={dailyLog?.totalCarbs || 0} unit="g" color="green" icon={<Wheat size={14}/>} />
                        <MacroMiniCard label="Fats" value={dailyLog?.totalFats || 0} unit="g" color="yellow" icon={<Droplets size={14}/>} />
                    </div>
                </section>

                <button
                    onClick={() => setIsSearchOpen(true)}
                    className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-100 hover:bg-blue-700 transition flex items-center justify-center gap-2"
                >
                    <Plus size={20} /> Log a Meal
                </button>

                <section>
                    <div className="flex items-center gap-2 mb-4 px-1">
                        <Utensils size={18} className="text-slate-400" />
                        <h2 className="font-bold text-slate-800">Today's Entries</h2>
                    </div>

                    <div className="space-y-3">
                        {dailyLog?.entries.length === 0 ? (
                            <div className="text-center py-10 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                                <p className="text-slate-400 text-sm italic">No food logged yet. Start eating!</p>
                            </div>
                        ) : (
                            dailyLog?.entries.map(entry => (
                                <div key={entry.id} className="bg-white p-4 rounded-2xl border border-slate-100 flex justify-between items-center group">
                                    <div>
                                        <p className="font-bold text-slate-700 text-sm">{entry.foodName}</p>
                                        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">
                                            {entry.quantity} {entry.unit} • {entry.totalCalories} kcal
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => removeMeal(entry.id)}
                                        className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </section>
            </div>
        </MainDashboardLayout>
    );
};

const MacroMiniCard = ({ label, value, unit, color, icon }: any) => {
    const colors: any = {
        blue: "bg-blue-50 text-blue-600 border-blue-100",
        green: "bg-green-50 text-green-600 border-green-100",
        yellow: "bg-yellow-50 text-yellow-600 border-yellow-100",
    };
    return (
        <div className={`p-3 rounded-2xl border ${colors[color]} text-center`}>
            <div className="flex justify-center mb-1">{icon}</div>
            <p className="text-[9px] font-bold uppercase opacity-70 tracking-tighter leading-none mb-1">{label}</p>
            <p className="text-sm font-black">{value}{unit}</p>
        </div>
    );
};

export default CaloriesMainPage;