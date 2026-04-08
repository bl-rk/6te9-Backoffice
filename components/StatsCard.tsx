
import React from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, trend }) => {
  return (
    <div className="p-6 bg-white border border-zinc-200 rounded-2xl hover:shadow-xl hover:shadow-zinc-100 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <span className="p-2.5 bg-zinc-50 rounded-xl text-black border border-zinc-100">
          {icon}
        </span>
        {trend && (
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
            {trend}
          </span>
        )}
      </div>
      <div>
        <p className="text-sm font-medium text-zinc-500">{title}</p>
        <p className="text-3xl font-black mt-1 tracking-tight">{value}</p>
      </div>
    </div>
  );
};

export default StatsCard;
