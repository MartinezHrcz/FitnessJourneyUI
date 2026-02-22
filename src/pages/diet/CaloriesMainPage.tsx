import MainDashboardLayout from "../../layouts/user/MainDashboardLayout.tsx";
import { useEffect, useState } from "react";
import type { user } from "../../types/User.ts";
import {Utensils, Plus, Trash2, History} from "lucide-react";
import { calorieLogApi } from "../../api/diet/calorieLogApi.ts";
import { foodItemApi } from "../../api/diet/dietApi.ts";
import type {CalorieLogDTO, FoodItemCreateDTO, FoodItemDTO} from "../../types/diet/Diet.ts";
import {SearchModal} from "./components/SearchModal.tsx";
import {CreateFoodModal} from "./components/CreateFoodModal.tsx";
import {Link} from "react-router-dom";
import {DailyCalorieSummary} from "./components/DailyCaloriesSummary.tsx";

const CaloriesMainPage = () => {
    const [user, setUser] = useState<user | null>(null);
    const [dailyLog, setDailyLog] = useState<CalorieLogDTO | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<FoodItemDTO[]>([]);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const today = new Date().toISOString().split('T')[0];


    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newFoodData, setNewFoodData] = useState<FoodItemCreateDTO>({
        name: "",
        servingSize: 100,
        servingUnit: "g",
        calories: 0,
        protein: 0,
        carbs: 0,
        fats: 0
    });

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
        if (query.length > 1) {
            const res = await foodItemApi.searchFoods(query, undefined);
            setSearchResults(res.data);
        } else {
            setSearchResults([]);
        }
    };

    const handleCreateFood = async () => {
        try {
            const res = await foodItemApi.createFoodItem(newFoodData);
            await addMeal(res.data.id);
            setIsCreateModalOpen(false);
            setNewFoodData({ name: "", servingSize: 100, servingUnit: "g", calories: 0, protein: 0, carbs: 0, fats: 0 });
        } catch {
            alert("Error creating food item. Please check the values.");
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
    return (
        <MainDashboardLayout user={user} activePath="/calories" title="Fuel your journey">

            <SearchModal
                isOpen={isSearchOpen}
                onClose={() => setIsSearchOpen(false)}
                onSearch={handleSearch}
                results={searchResults}
                onAdd={addMeal}
                searchQuery={searchQuery}
                onCreateNew={
                    function (): void {
                        setIsSearchOpen(false);
                        setIsCreateModalOpen(true);
                    }}
            />

            <CreateFoodModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                formData={newFoodData}
                setFormData={setNewFoodData}
                onSubmit={handleCreateFood}
            />

            <div className="flex justify-between items-end mb-4 px-1">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 dark:text-white transition-colors">Nutrition</h1>
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">{new Date().toDateString()}</p>
                </div>
                <Link
                    to="/calories/history"
                    className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 rounded-xl text-xs font-bold hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-all shadow-sm border border-slate-200/50 dark:border-slate-800"
                >
                    <History size={14} />
                    View History
                </Link>
            </div>

            <div className="space-y-6 pb-20">
                <DailyCalorieSummary
                    totalCalories={dailyLog?.totalCalories || 0}
                    goal={calorieGoal}
                    protein={dailyLog?.totalProtein || 0}
                    carbs={dailyLog?.totalCarbs || 0}
                    fats={dailyLog?.totalFats || 0}
                />

                <button
                    onClick={() => setIsSearchOpen(true)}
                    className="w-full py-4 bg-blue-600 dark:bg-blue-500 text-white font-bold rounded-2xl shadow-lg shadow-blue-100 dark:shadow-none hover:bg-blue-700 dark:hover:bg-blue-600 transition flex items-center justify-center gap-2"
                >
                    <Plus size={20} /> Log a Meal
                </button>

                <section>
                    <div className="flex items-center gap-2 mb-4 px-1">
                        <Utensils size={18} className="text-slate-400 dark:text-slate-500" />
                        <h2 className="font-bold text-slate-800 dark:text-white transition-colors">Today's Entries</h2>
                    </div>

                    <div className="space-y-3">
                        {dailyLog?.entries?.length === 0 ? (
                            <div className="text-center py-10 bg-slate-50 dark:bg-slate-900/40 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 transition-colors">
                                <p className="text-slate-400 dark:text-slate-600 text-sm italic">No food logged yet. Start eating!</p>
                            </div>
                        ) : (
                            dailyLog?.entries.map(entry => (
                                <div key={entry.id} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 flex justify-between items-center group transition-all">
                                    <div>
                                        <p className="font-bold text-slate-700 dark:text-slate-200 text-sm">{entry.foodName}</p>
                                        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium uppercase tracking-tighter">
                                            {entry.quantity} {entry.unit} • {entry.totalCalories} kcal
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => removeMeal(entry.id)}
                                        className="p-2 text-slate-300 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
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

export default CaloriesMainPage;