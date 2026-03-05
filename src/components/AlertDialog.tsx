import { AlertCircle, X } from "lucide-react";

interface AlertProps {
    message?: string;
    type?: "error" | "warning" | "success";
    onClose: () => void;
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