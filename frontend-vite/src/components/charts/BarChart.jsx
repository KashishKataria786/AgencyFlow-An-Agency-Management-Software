import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const CustomBarChart = ({ data, dataKey, xAxisKey = 'name', color = '#6366f1', horizontal = false }) => {
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 rounded-sm border border-slate-200 shadow-lg">
                    <p className="text-xs font-bold text-slate-900">
                        {payload[0].payload[xAxisKey]}
                    </p>
                    <p className="text-[10px] text-slate-500">
                        {payload[0].value}
                    </p>
                </div>
            );
        }
        return null;
    };

    if (horizontal) {
        return (
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis
                        type="number"
                        tick={{ fontSize: 11, fill: '#94a3b8' }}
                        tickLine={false}
                        axisLine={{ stroke: '#e2e8f0' }}
                    />
                    <YAxis
                        type="category"
                        dataKey={xAxisKey}
                        tick={{ fontSize: 11, fill: '#94a3b8' }}
                        tickLine={false}
                        axisLine={{ stroke: '#e2e8f0' }}
                        width={100}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey={dataKey} fill={color} radius={[0, 4, 4, 0]} />
                </BarChart>
            </ResponsiveContainer>
        );
    }

    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                    dataKey={xAxisKey}
                    tick={{ fontSize: 11, fill: '#94a3b8' }}
                    tickLine={false}
                    axisLine={{ stroke: '#e2e8f0' }}
                />
                <YAxis
                    tick={{ fontSize: 11, fill: '#94a3b8' }}
                    tickLine={false}
                    axisLine={{ stroke: '#e2e8f0' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default React.memo(CustomBarChart);
