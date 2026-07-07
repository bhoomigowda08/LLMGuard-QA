import React from 'react';

const StatCard = ({ title, value, icon: Icon, description, trend, trendType = 'neutral' }) => {
  const trendColor = {
    positive: 'text-green-400 bg-green-500/10 border border-green-500/20',
    negative: 'text-red-400 bg-red-500/10 border border-red-500/20',
    neutral: 'text-slate-400 bg-slate-500/10 border border-slate-500/20'
  }[trendType];

  return (
    <div className="glass-panel p-6 rounded-xl relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-brandblue/5">
      {/* Visual Accent */}
      <div className="absolute top-0 left-0 w-1.5 h-full bg-brandblue/30"></div>
      
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</span>
          <h3 className="text-3xl font-extrabold text-white tracking-tight">{value}</h3>
        </div>
        <div className="p-3 rounded-lg bg-darkborder text-brandblue">
          <Icon size={22} />
        </div>
      </div>
      
      <div className="flex items-center gap-2 mt-4">
        {trend && (
          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${trendColor}`}>
            {trend}
          </span>
        )}
        <span className="text-xs text-slate-500 font-medium truncate">{description}</span>
      </div>
    </div>
  );
};

export default StatCard;
