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
    <section className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                    <BarChart3 size={18} />
                </div>
                <h2 className="font-bold text-slate-800">7-Day Overview</h2>
            </div>
        </div>

        <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                    <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#94a3b8', fontSize: 10 }}
                    />
                    <Tooltip
                        cursor={{ fill: '#f8fafc' }}
                        content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                                return (
                                    <div className="bg-slate-800 text-white p-2 rounded-lg text-[10px] font-bold shadow-xl">
                                        {payload[0].value} kcal
                                    </div>
                                );
                            }
                            return null;
                        }}
                    />
                    <ReferenceLine y={goal} stroke="#cbd5e1" strokeDasharray="3 3" />
                    <Bar dataKey="calories" radius={[6, 6, 6, 6]} barSize={24}>
                        {data.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={entry.calories > goal ? '#f97316' : '#3b82f6'}
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    </section>
);