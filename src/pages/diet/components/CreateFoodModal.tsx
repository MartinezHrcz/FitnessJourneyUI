import { X } from "lucide-react";
import type {FoodItemCreateDTO} from "../../../types/diet/Diet.ts";

interface CreateFoodModalProps {
    isOpen: boolean;
    onClose: () => void;
    formData: FoodItemCreateDTO;
    setFormData: (data: FoodItemCreateDTO) => void;
    onSubmit: () => void;
}

export const CreateFoodModal = ({
                                    isOpen,
                                    onClose,
                                    formData,
                                    setFormData,
                                    onSubmit
                                }: CreateFoodModalProps) => {
    if (!isOpen) return null;

    const handleChange = (field: keyof FoodItemCreateDTO, value: string | number) => {
        setFormData({ ...formData, [field]: value });
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/70 backdrop-blur-md animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl p-8 border border-slate-100 dark:border-slate-800 relative transition-colors">

                <button onClick={onClose} className="absolute right-6 top-6 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                    <X size={20} />
                </button>

                <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Create New Food</h2>

                <div className="space-y-4">
                    <div>
                        <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase ml-1">Food Name</label>
                        <input
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition"
                            placeholder="e.g. Protein Bar"
                            value={formData.name}
                            onChange={(e) => handleChange("name", e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <InputGroup label="Serving Size" type="number" placeholder="100"
                                    value={formData.servingSize} onChange={(e: any) => handleChange("servingSize", Number(e.target.value))} />
                        <InputGroup label="Unit" placeholder="g / ml"
                                    value={formData.servingUnit} onChange={(e: any) => handleChange("servingUnit", e.target.value)} />
                    </div>

                    <div className="grid grid-cols-2 gap-4 border-t border-slate-50 dark:border-slate-800 pt-4">
                        <InputGroup label="Calories (kcal)" type="number"
                                    value={formData.calories} onChange={(e: any) => handleChange("calories", Number(e.target.value))} />
                        <InputGroup label="Protein (g)" type="number"
                                    value={formData.protein} onChange={(e: any) => handleChange("protein", Number(e.target.value))} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <InputGroup label="Carbohydrates (g)" type="number"
                                    value={formData.carbs} onChange={(e: any) => handleChange("carbs", Number(e.target.value))} />
                        <InputGroup label="Fats (g)" type="number"
                                    value={formData.fats} onChange={(e: any) => handleChange("fats", Number(e.target.value))} />
                    </div>
                </div>

                <div className="flex gap-3 mt-8">
                    <button onClick={onClose} className="flex-1 py-3 text-slate-500 dark:text-slate-400 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition">
                        Cancel
                    </button>
                    <button
                        onClick={onSubmit}
                        disabled={!formData.name}
                        className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-md hover:bg-blue-700 dark:hover:bg-blue-500 transition disabled:opacity-50"
                    >
                        Save & Log
                    </button>
                </div>
            </div>
        </div>
    );
};

const InputGroup = ({ label, ...props }: any) => (
    <div>
        <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase ml-1">{label}</label>
        <input {...props} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition placeholder:text-slate-300 dark:placeholder:text-slate-600" />
    </div>
);