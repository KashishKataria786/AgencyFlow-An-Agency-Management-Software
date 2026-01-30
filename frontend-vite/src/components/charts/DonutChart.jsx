import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const DonutChart = ({ data, colors = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'] }) => {
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 rounded-sm border border-slate-200 shadow-lg">
                    <p className="text-xs font-bold text-slate-900">
                        {payload[0].name}
                    </p>
                    <p className="text-[10px] text-slate-500">
                        {payload[0].value} ({((payload[0].value / data.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(1)}%)
                    </p>
                </div>
            );
        }
        return null;
    };

    const CustomLegend = ({ payload }) => {
        return (
            <div className="flex flex-wrap justify-center gap-4 mt-4">
                {payload.map((entry, index) => (
                    <div key={index} className="flex items-center space-x-2">
                        <div
                            className="w-3 h-3 rounded-sm"
                            style={{ backgroundColor: entry.color }}
                        />
                        <span className="text-xs text-slate-600 font-medium">
                            {entry.value}
                        </span>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend content={<CustomLegend />} />
            </PieChart>
        </ResponsiveContainer>
    );
};

export default React.memo(DonutChart);
