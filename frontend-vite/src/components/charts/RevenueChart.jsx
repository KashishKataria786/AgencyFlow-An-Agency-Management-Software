import React from 'react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const RevenueChart = ({ data, type = 'area' }) => {
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 rounded-sm border border-slate-200 shadow-lg">
                    <p className="text-xs font-bold text-slate-900">
                        ${payload[0].value.toLocaleString()}
                    </p>
                    <p className="text-[10px] text-slate-500">
                        {payload[0].payload.month}
                    </p>
                </div>
            );
        }
        return null;
    };

    const ChartComponent = type === 'area' ? AreaChart : LineChart;
    const DataComponent = type === 'area' ? Area : Line;

    return (
        <ResponsiveContainer width="100%" height={300}>
            <ChartComponent data={data}>
                <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                    dataKey="month"
                    tick={{ fontSize: 11, fill: '#94a3b8' }}
                    tickLine={false}
                    axisLine={{ stroke: '#e2e8f0' }}
                />
                <YAxis
                    tick={{ fontSize: 11, fill: '#94a3b8' }}
                    tickLine={false}
                    axisLine={{ stroke: '#e2e8f0' }}
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <DataComponent
                    type="monotone"
                    dataKey="revenue"
                    stroke="#6366f1"
                    strokeWidth={2}
                    fill={type === 'area' ? "url(#colorRevenue)" : undefined}
                    dot={{ fill: '#6366f1', r: 4 }}
                    activeDot={{ r: 6 }}
                />
            </ChartComponent>
        </ResponsiveContainer>
    );
};

export default React.memo(RevenueChart);
