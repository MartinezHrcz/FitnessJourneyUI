import {BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, Cell} from 'recharts';
import { BarChart3 } from "lucide-react";

interface ChartData {
    name: string;
    calories: number;
}

interface Props {
    data: ChartData[];
    goal: number;
}

export const CalorieHistoryChart = ({ data, goal }: Props) => (
    <section className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm transition-colors duration-300">
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                    <BarChart3 size={18} />
                </div>
                <h2 className="font-bold text-slate-800 dark:text-white">7-Day Overview</h2>
            </div>
        </div>

        <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                    <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600 }}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#64748b', fontSize: 10 }}
                    />
                    <Tooltip
                        cursor={{ fill: 'currentColor', className: 'text-slate-100 dark:text-slate-800/50' }}
                        content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                                return (
                                    <div className="bg-slate-800 dark:bg-slate-700 text-white p-2 rounded-lg text-[10px] font-bold shadow-xl border border-slate-700 dark:border-slate-600">
                                        {payload[0].value} kcal
                                    </div>
                                );
                            }
                            return null;
                        }}
                    />
                    <ReferenceLine
                        y={goal}
                        stroke="#94a3b8"
                        strokeDasharray="3 3"
                        className="dark:stroke-slate-700"
                    />
                    <Bar dataKey="calories" radius={[6, 6, 6, 6]} barSize={24}>
                        {data.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                className="transition-all duration-500"
                                fill={entry.calories > goal ? '#f97316' : '#3b82f6'}
                                fillOpacity={0.9}
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    </section>
);