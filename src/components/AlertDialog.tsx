import { AlertCircle, X } from "lucide-react";

interface AlertProps {
    message?: string;
    type?: "error" | "warning" | "success";
    onClose: () => void;
}

interface ConfirmDialogProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    confirmVariant?: "danger" | "primary";
    onConfirm: () => void;
    onCancel: () => void;
}

export const Alert: React.FC<AlertProps> = ({message, type = "error", onClose }) => {
    const styles = {
        error: "bg-red-50 border-red-200 text-red-800 dark:bg-red-900/50 dark:border-red-800 dark:text-red-200",
        warning: "bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-400",
        success: "bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-400",
    };

    if (message != null){
        return (
        <div className={`fixed bottom-6 right-6 z-[100] w-[calc(100%-3rem)] max-w-sm 
            flex items-center justify-between p-4 border rounded-2xl shadow-2xl 
            animate-in fade-in slide-in-from-right-8 duration-300 ${styles[type]}`}>
                <div className="flex items-center gap-3">
                    <AlertCircle size={18} />
                    <p className="text-sm font-medium">{message}</p>
                </div>
                <button
                    onClick={onClose}
                    className="p-1 hover:bg-white/20 dark:hover:bg-black/20 rounded-full transition-colors"
                >
                    <X size={16} />
                </button>
        </div>)
    }
};

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    isOpen,
    title,
    message,
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    confirmVariant = "danger",
    onConfirm,
    onCancel,
}) => {
    if (!isOpen) return null;

    const confirmClassName =
        confirmVariant === "danger"
            ? "bg-red-600 hover:bg-red-700"
            : "bg-blue-600 hover:bg-blue-700";

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl p-6 border border-slate-100 dark:border-slate-800">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">{title}</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">{message}</p>
                <div className="flex gap-3 mt-8">
                    <button
                        onClick={onCancel}
                        className="flex-1 py-3 text-slate-500 dark:text-slate-400 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition"
                    >
                        {cancelLabel}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`flex-1 py-3 text-white font-bold rounded-xl shadow-md transition ${confirmClassName}`}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
};