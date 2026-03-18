interface TabButtonProps {
    active: boolean;
    onClick: () => void;
    label: string;
    icon: React.ReactNode;
}

const TabButton = ({ active, onClick, label, icon }: TabButtonProps) => {
    return (
        <button
            onClick={onClick}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all duration-200 
        ${active
                ? "bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400"
                : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            }`}
        >
            {icon}
            <span>{label}</span>
        </button>
    );
};

export default TabButton;