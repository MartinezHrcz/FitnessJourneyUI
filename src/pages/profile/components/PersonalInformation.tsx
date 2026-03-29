import { Mail, Calendar, Scale, Edit2 } from "lucide-react";
import InfoRow from "./InfoRow.tsx";
import type { user } from "../../../types/User.ts";

interface PersonalInformationProps {
    user: user;
    age: number;
    onEditProfile: () => void;
}

const PersonalInformation = ({ user, age, onEditProfile }: PersonalInformationProps) => (
    <section className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="p-6 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center">
            <h2 className="font-bold text-slate-800 dark:text-white">Personal Information</h2>
            <button
                onClick={onEditProfile}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            >
                <Edit2 size={16} />
                Edit
            </button>
        </div>
        <div className="divide-y divide-slate-50 dark:divide-slate-800">
            <InfoRow icon={<Mail size={18}/>} label="Email Address" value={user.email} />
            <InfoRow icon={<Calendar size={18}/>} label="Birthday" value={`${new Date(user.birthday).toLocaleDateString()} (${age} years)`} />
            {user.preferredCalories && (
                <InfoRow icon={<Scale size={18}/>} label="Daily Calories Goal" value={`${user.preferredCalories} kcal`} />
            )}
        </div>
    </section>
);

export default PersonalInformation;
