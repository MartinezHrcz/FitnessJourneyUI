interface MetricCardProps {
    icon: React.ReactNode;
    label: string;
    value: string;
}

const MetricCard = ({ icon, label, value }: MetricCardProps) => (
    <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm text-center transition-colors">
        <div className="flex justify-center mb-2">{icon}</div>
        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tight">{label}</p>
        <p className="text-lg font-black text-slate-800 dark:text-white">{value}</p>
    </div>
);

export default MetricCard;
