import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const MetricCard = ({ title, value, trend, trendValue, icon: Icon, color = 'primary' }) => {
    const isPositive = trend === 'up';
    const colorClasses = {
        primary: 'bg-primary-light text-primary',
        green: 'bg-emerald-50 text-emerald-600',
        blue: 'bg-blue-50 text-blue-600',
        amber: 'bg-amber-50 text-amber-600',
        purple: 'bg-purple-50 text-purple-600'
    };

    return (
        <div className="bg-white p-6 rounded-sm border border-slate-200 shadow-sm transition-all hover:border-primary/30 hover:shadow-md">
            <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {title}
                </span>
                <div className={`${colorClasses[color]} p-2 rounded-sm`}>
                    {Icon && <Icon size={18} />}
                </div>
            </div>
            <div className="flex items-end justify-between">
                <div>
                    <p className="text-3xl font-black text-slate-900 leading-none mb-1">
                        {value}
                    </p>
                    {trendValue && (
                        <div className="flex items-center space-x-1">
                            {isPositive ? (
                                <TrendingUp size={14} className="text-emerald-600" />
                            ) : (
                                <TrendingDown size={14} className="text-rose-600" />
                            )}
                            <span className={`text-xs font-bold ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                                {trendValue}
                            </span>
                            <span className="text-xs text-slate-400">vs last month</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default React.memo(MetricCard);
