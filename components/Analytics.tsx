import React from 'react';
import {
  ShoppingCart,
  Users,
  Activity,
  TrendingUp,
  Layers,
  ArrowUpRight,
  Loader2
} from 'lucide-react';
import StatsCard from './StatsCard';
import { inventoryService } from '../services/inventoryService';
import { leadService } from '../services/leadService';
import { broadcastService } from '../services/broadcastService';
import { LeadStage } from '../types';
import { useEffect, useState } from 'react';

const Analytics: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    portfolioValue: 0,
    totalLeads: 0,
    conversionRate: 0,
    inventoryCount: 0,
    broadcastCount: 0,
    verticals: { tech: 0, media: 0, culinary: 0 }
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [items, leads, broadcasts] = await Promise.all([
          inventoryService.getAllItems(),
          leadService.getLeads(),
          broadcastService.getBroadcasts()
        ]);

        const portfolioValue = items.reduce((acc, item) => acc + (item.price || 0), 0);
        const converted = leads.filter(l => l.stage === LeadStage.CONVERTED).length;
        const conversionRate = leads.length > 0 ? (converted / leads.length) * 100 : 0;

        const verticals = items.reduce((acc, item) => {
          const type = item.marketplace?.toLowerCase();
          if (type && type in acc) acc[type as keyof typeof acc]++;
          return acc;
        }, { tech: 0, media: 0, culinary: 0 });

        setStats({
          portfolioValue,
          totalLeads: leads.length,
          conversionRate,
          inventoryCount: items.length,
          broadcastCount: broadcasts.length,
          verticals
        });
      } catch (err) {
        console.error('Failed to aggregate BI stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const primaryStats = [
    {
      label: 'Portfolio Value',
      value: `₦${(stats.portfolioValue / 1000000).toFixed(1)}M`,
      icon: <TrendingUp className="w-5 h-5" />,
      trend: '+5.2% ↑'
    },
    {
      label: 'Pipeline Leads',
      value: stats.totalLeads.toLocaleString(),
      icon: <Users className="w-5 h-5" />,
      trend: '+18.5% ↑'
    },
    {
      label: 'Conversion Rate',
      value: `${stats.conversionRate.toFixed(1)}%`,
      icon: <Activity className="w-5 h-5" />,
      trend: 'Real-time'
    },
    {
      label: 'Active Broadcasts',
      value: stats.broadcastCount.toString(),
      icon: <Layers className="w-5 h-5" />,
      trend: 'Live Feed'
    }
  ];

  const distribution = (() => {
    const total = stats.verticals.tech + stats.verticals.media + stats.verticals.culinary || 1;
    return [
      { label: 'Tech', percentage: Math.round((stats.verticals.tech / total) * 100), color: 'bg-black' },
      { label: 'Culinary', percentage: Math.round((stats.verticals.culinary / total) * 100), color: 'bg-zinc-400' },
      { label: 'Media', percentage: Math.round((stats.verticals.media / total) * 100), color: 'bg-zinc-100' }
    ];
  })();

  const VelocityChart = () => (
    <svg className="w-full h-48 overflow-visible" viewBox="0 0 400 100" preserveAspectRatio="none">
      <defs>
        <linearGradient id="velocityGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="white" stopOpacity={0.2} />
          <stop offset="95%" stopColor="white" stopOpacity={0} />
        </linearGradient>
      </defs>
      <path
        d="M0,80 Q50,40 100,60 T200,30 T300,50 T400,20 L400,100 L0,100 Z"
        fill="url(#velocityGradient)"
      />
      <path
        d="M0,80 Q50,40 100,60 T200,30 T300,50 T400,20"
        fill="none"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {[0, 100, 200, 300, 400].map((x, i) => (
        <circle key={i} cx={x} cy={[80, 60, 30, 50, 20][i]} r="3" fill="white" />
      ))}
    </svg>
  );

  const DonutChart = () => (
    <div className="relative w-40 h-40 mx-auto">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f4f4f5" strokeWidth="12" />
        <circle
          cx="50" cy="50" r="40" fill="transparent" stroke="black" strokeWidth="12"
          strokeDasharray="120.6 130.4" strokeDashoffset="0"
        />
        <circle
          cx="50" cy="50" r="40" fill="transparent" stroke="#a1a1aa" strokeWidth="12"
          strokeDasharray="80.4 170.6" strokeDashoffset="-120.6"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-black italic">{stats.inventoryCount}</span>
        <span className="text-[8px] font-black uppercase tracking-widest text-zinc-400">Items</span>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-300" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      <div>
        <h2 className="text-2xl font-black italic uppercase tracking-tighter">Business Intelligence</h2>
        <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest mt-1">Core Performance Metrics</p>
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
        <div className="lg:col-span-2 bg-black text-white rounded-[2.5rem] p-10 overflow-hidden relative">
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-lg font-black italic uppercase tracking-tighter">Sales Velocity</h3>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Real-time Transaction Flow</p>
              </div>
              <ArrowUpRight className="w-5 h-5 text-zinc-700" />
            </div>
            <div className="flex-1 flex items-end">
              <VelocityChart />
            </div>
          </div>
        </div>

        <div className="bg-white border border-zinc-200 rounded-[2.5rem] p-10 flex flex-col shadow-sm">
          <h3 className="text-[10px] font-black uppercase tracking-widest italic mb-8">Marketplace Distribution</h3>
          <DonutChart />
          <div className="mt-10 space-y-3">
            {distribution.map((m, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${m.color}`} />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">{m.label}</span>
                </div>
                <span className="text-[10px] font-black">{m.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
