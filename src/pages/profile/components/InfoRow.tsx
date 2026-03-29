interface InfoRowProps {
    icon: React.ReactNode;
    label: string;
    value: string;
}

const InfoRow = ({ icon, label, value }: InfoRowProps) => (
    <div className="flex items-center gap-4 p-4">
        <div className="p-2 bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 rounded-xl transition-colors">{icon}</div>
        <div>
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase leading-none mb-1">{label}</p>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{value}</p>
        </div>
    </div>
);

export default InfoRow;
