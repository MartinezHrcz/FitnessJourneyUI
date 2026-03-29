import { Save, X } from "lucide-react";
import type { user } from "../../../types/User.ts";

interface EditProfileFormProps {
    editFormData: Partial<user>;
    onEditFormChange: (field: keyof user, value: any) => void;
    onSaveProfile: () => Promise<void>;
    onCancelEdit: () => void;
    isSaving: boolean;
    profileError: string | null;
}

const EditProfileForm = ({
    editFormData,
    onEditFormChange,
    onSaveProfile,
    onCancelEdit,
    isSaving,
    profileError
}: EditProfileFormProps) => (
    <div className="space-y-6 animate-in fade-in duration-300">
        {profileError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {profileError}
            </div>
        )}
        <section className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-100 dark:border-slate-800">
            <h2 className="font-bold text-slate-800 dark:text-white mb-6">Edit Profile</h2>
            
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Name</label>
                    <input
                        type="text"
                        value={editFormData.name || ''}
                        onChange={(e) => onEditFormChange('name', e.target.value)}
                        className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-white"
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Email</label>
                    <input
                        type="email"
                        value={editFormData.email || ''}
                        onChange={(e) => onEditFormChange('email', e.target.value)}
                        className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-white"
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Birthday</label>
                    <input
                        type="date"
                        value={editFormData.birthday ? new Date(editFormData.birthday).toISOString().split('T')[0] : ''}
                        onChange={(e) => onEditFormChange('birthday', new Date(e.target.value))}
                        className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-white"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Weight (kg)</label>
                        <input
                            type="number"
                            step="0.1"
                            value={editFormData.weightInKg || ''}
                            onChange={(e) => onEditFormChange('weightInKg', parseFloat(e.target.value))}
                            className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Height (cm)</label>
                        <input
                            type="number"
                            step="0.1"
                            value={editFormData.heightInCm || ''}
                            onChange={(e) => onEditFormChange('heightInCm', parseFloat(e.target.value))}
                            className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-white"
                        />
                    </div>
                </div>
            </div>

            <div className="flex gap-3 mt-8">
                <button
                    onClick={onSaveProfile}
                    disabled={isSaving}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3 rounded-lg transition-colors"
                >
                    <Save size={18} />
                    {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                    onClick={onCancelEdit}
                    disabled={isSaving}
                    className="flex-1 flex items-center justify-center gap-2 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-600 text-slate-800 dark:text-white font-bold py-3 rounded-lg transition-colors"
                >
                    <X size={18} />
                    Cancel
                </button>
            </div>
        </section>
    </div>
);

export default EditProfileForm;
