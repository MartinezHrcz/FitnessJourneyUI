import { useState, useEffect } from "react";
import { Search, Edit2, Trash2, ArrowLeft, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { workoutPlanApi } from "../../api/workouts/workoutPlanApi.ts";
import type { WorkoutPlanDTO } from "../../types/fitness/WorkoutPlan.ts";
import MainDashboardLayout from "../../layouts/user/MainDashboardLayout.tsx";
import {Alert, ConfirmDialog} from "../../components/AlertDialog.tsx";

export const WorkoutPlanManager = () => {
    const navigate = useNavigate();
    const [plans, setPlans] = useState<WorkoutPlanDTO[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [user, setUser] = useState<any>(null);
    const [error, setError] = useState<string | undefined>(undefined);
    const [pendingDeletePlanId, setPendingDeletePlanId] = useState<string | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) setUser(JSON.parse(storedUser));

        fetchPlans();
    }, []);

    const fetchPlans = () => {
        workoutPlanApi.getAvailable().then(res => setPlans(res.data));
    };

    const confirmDelete = async () => {
        if (!pendingDeletePlanId) return;
        try {
            await workoutPlanApi.delete(pendingDeletePlanId);
            setPlans(plans.filter(p => p.id !== pendingDeletePlanId));
        } catch (err) {
            console.error(err);
            setError("Failed to delete plan. You can only delete plans you created.");
        } finally {
            setPendingDeletePlanId(null);
        }
    };

    const filteredPlans = plans.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <MainDashboardLayout user={user} activePath="/workouts" title="Manage Plans">
            <Alert
                message={error}
                onClose={() => setError(undefined)} />
            <ConfirmDialog
                isOpen={pendingDeletePlanId !== null}
                title="Delete Plan"
                message="Are you sure you want to delete this plan?"
                confirmLabel="Delete"
                cancelLabel="Cancel"
                confirmVariant="danger"
                onConfirm={confirmDelete}
                onCancel={() => setPendingDeletePlanId(null)}
            />
            <div className="max-w-4xl mx-auto p-4">
                <div className="flex items-center gap-4 mb-6">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-xl font-bold">Your Workout Library</h1>
                </div>

                <div className="flex gap-3 mb-8">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Search plans..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => navigate('/workouts/plans/create')}
                        className="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700"
                    >
                        <Plus size={18} /> <span className="hidden sm:inline">Create</span>
                    </button>
                </div>

                <div className="space-y-3">
                    {filteredPlans.map(plan => (
                        <div key={plan.id} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 flex justify-between items-center group">
                            <div>
                                <h3 className="font-bold text-slate-800 dark:text-white">{plan.name}</h3>
                                <p className="text-xs text-slate-400">{plan.exercises.length} Exercises</p>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => navigate(`/workouts/plans/edit/${plan.id}`)}
                                    className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                >
                                    <Edit2 size={18} />
                                </button>
                                {plan.creatorId === user?.id && (
                                    <button
                                        onClick={() => setPendingDeletePlanId(plan.id)}
                                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                    {filteredPlans.length === 0 && (
                        <div className="text-center py-10 text-slate-500">No plans found matching your search.</div>
                    )}
                </div>
            </div>
        </MainDashboardLayout>
    );
};