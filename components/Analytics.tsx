import React from 'react';
import {
  BarChart3,
  TrendingUp,
  Users,
  ShoppingCart,
  ArrowUpRight,
  ArrowDownRight,
  Globe,
  Zap,
  Activity,
  Layers
} from 'lucide-react';
import StatsCard from './StatsCard';

const Analytics: React.FC = () => {
  const primaryStats = [
    { label: 'Gross Sales (MTD)', value: '₦12,450,000', icon: <ShoppingCart className="w-5 h-5" />, trend: '+14.2% ↑' },
    { label: 'Active Users', value: '42,890', icon: <Users className="w-5 h-5" />, trend: '+5.1% ↑' },
    { label: 'Conversion Rate', value: '3.8%', icon: <Activity className="w-5 h-5" />, trend: '-0.4% ↓' },
    { label: 'Avg. Order Value', value: '₦85,200', icon: <TrendingUp className="w-5 h-5" />, trend: '+12.5% ↑' }
  ];

  // SVG Chart Components for improved rendering
  const AreaChart = () => (
    <svg className="w-full h-48 overflow-visible" viewBox="0 0 400 100" preserveAspectRatio="none">
      <defs>
        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="white" stopOpacity={0.3} />
          <stop offset="95%" stopColor="white" stopOpacity={0} />
        </linearGradient>
      </defs>
      <path
        d="M0,80 Q50,40 100,60 T200,30 T300,50 T400,20 L400,100 L0,100 Z"
        fill="url(#chartGradient)"
      />
      <path
        d="M0,80 Q50,40 100,60 T200,30 T300,50 T400,20"
        fill="none"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Points */}
      {[0, 100, 200, 300, 400].map((x, i) => (
        <circle key={i} cx={x} cy={[80, 60, 30, 50, 20][i]} r="3" fill="white" />
      ))}
    </svg>
  );

  const DonutChart = () => (
    <div className="relative w-48 h-48 mx-auto">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        {/* Background circle */}
        <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f4f4f5" strokeWidth="12" />
        {/* Tech Share - 48% */}
        <circle
          cx="50" cy="50" r="40" fill="transparent" stroke="black" strokeWidth="12"
          strokeDasharray="120.6 130.4" strokeDashoffset="0"
        />
        {/* Culinary Share - 32% */}
        <circle
          cx="50" cy="50" r="40" fill="transparent" stroke="#a1a1aa" strokeWidth="12"
          strokeDasharray="80.4 170.6" strokeDashoffset="-120.6"
        />
        {/* Media Share - 20% */}
        <circle
          cx="50" cy="50" r="40" fill="transparent" stroke="#e4e4e7" strokeWidth="12"
          strokeDasharray="50.2 200.8" strokeDashoffset="-201"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-black italic tracking-tighter">100%</span>
        <span className="text-[8px] font-black uppercase text-zinc-400">Yield</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black italic uppercase tracking-tighter">Analytics Engine</h2>
          <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest mt-1">Global Intelligence & Performance Metrics</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-zinc-50 border border-zinc-100 rounded-full">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-widest">Live Feed</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {primaryStats.map((stat, idx) => (
          <StatsCard
            key={idx}
            title={stat.label}
            value={stat.value}
            icon={stat.icon}
            trend={stat.trend}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-black text-white rounded-[3rem] p-10 overflow-hidden relative group">
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-all" />

          <div className="relative z-10 flex flex-col h-full">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h3 className="text-xl font-black italic uppercase tracking-tighter">Strategic Traffic Flow</h3>
                <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mt-1">Comparative Monthly Projection</p>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-white"></span>
                  <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Conversion</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-zinc-700"></span>
                  <span className="text-[10px] font-black text-zinc-700 uppercase tracking-widest">Bounce Rate</span>
                </div>
              </div>
            </div>

            <div className="flex-1 flex items-end">
              <AreaChart />
            </div>

            <div className="flex justify-between mt-8 pt-8 border-t border-white/5">
              {['Jan', 'Mar', 'May', 'Jul', 'Sep', 'Nov'].map(m => (
                <span key={m} className="text-[10px] font-black uppercase tracking-widest text-zinc-600">{m}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white border border-zinc-200 rounded-[3rem] p-10 flex flex-col shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-sm font-black uppercase tracking-widest italic">Marketplace Dominance</h3>
            <Layers className="w-5 h-5 text-zinc-200" />
          </div>

          <DonutChart />

          <div className="mt-12 space-y-4">
            {[
              { label: 'Tech', percentage: 48, color: 'bg-black' },
              { label: 'Culinary', percentage: 32, color: 'bg-zinc-400' },
              { label: 'Media', percentage: 20, color: 'bg-zinc-200' }
            ].map((m, i) => (
              <div key={i} className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <span className={`w-3 h-3 rounded-full ${m.color}`} />
                  <span className="text-[10px] font-black uppercase tracking-widest group-hover:translate-x-1 transition-transform">{m.label}</span>
                </div>
                <span className="text-xs font-black italic">{m.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-zinc-900 text-white rounded-[2.5rem] p-10 flex flex-col md:flex-row items-center justify-between relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-white/5 to-transparent skew-x-12 transform translate-x-10" />

        <div className="flex items-center gap-6 relative z-10">
          <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/10">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-black italic text-lg uppercase tracking-tighter">Deep Analytics Export</h4>
            <p className="text-xs text-white/40 font-bold uppercase tracking-widest mt-1">Comprehensive SKU & Behavioral Reporting</p>
          </div>
        </div>
        <button className="px-10 py-5 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-100 transition-all shadow-2xl relative z-10 mt-6 md:mt-0">
          Sync & Export
        </button>
      </div>
    </div>
  );
};

export default Analytics;
