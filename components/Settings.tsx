import React from 'react';
import { Shield, Globe, Database, Save, Server, RefreshCw, Truck, Percent, CreditCard } from 'lucide-react';

interface SettingsProps {
  maintenanceMode: boolean;
  setMaintenanceMode: (val: boolean) => void;
  onOpenBulkUpload: () => void;
}

const Settings: React.FC<SettingsProps> = ({ maintenanceMode, setMaintenanceMode, onOpenBulkUpload }) => {
  return (
    <div className="max-w-4xl space-y-8 animate-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Core Configuration */}
        <div className="bg-white border border-zinc-200 rounded-[2.5rem] overflow-hidden shadow-sm">
          <div className="px-10 py-6 border-b border-zinc-100 bg-zinc-50/50 flex items-center gap-3">
            <Globe className="w-5 h-5 text-zinc-400" />
            <h3 className="text-xs font-black uppercase tracking-widest italic">Core Configuration</h3>
          </div>
          <div className="p-10 space-y-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest px-1">Platform Identity</label>
              <input
                type="text"
                defaultValue="6te9 Marketplace"
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-xs font-bold outline-none focus:ring-1 focus:ring-black transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest px-1">Support Endpoint</label>
              <input
                type="email"
                defaultValue="ops@6te9.com"
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-xs font-bold outline-none focus:ring-1 focus:ring-black transition-all"
              />
            </div>
            <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest">Maintenance Mode</p>
                <p className="text-[8px] text-zinc-400 font-bold uppercase tracking-tight mt-0.5">Restrict Public Access</p>
              </div>
              <button
                onClick={() => setMaintenanceMode(!maintenanceMode)}
                className={`w-12 h-6 rounded-full transition-all relative ${maintenanceMode ? 'bg-black' : 'bg-zinc-200'}`}
              >
                <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${maintenanceMode ? 'left-7' : 'left-1'}`}></span>
              </button>
            </div>
          </div>
        </div>

        {/* Commerce Settings */}
        <div className="bg-white border border-zinc-200 rounded-[2.5rem] overflow-hidden shadow-sm">
          <div className="px-10 py-6 border-b border-zinc-100 bg-zinc-50/50 flex items-center gap-3">
            <Percent className="w-5 h-5 text-zinc-400" />
            <h3 className="text-xs font-black uppercase tracking-widest italic">Commerce Engine</h3>
          </div>
          <div className="p-10 space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest px-1">Base Tax Rate (%)</label>
              <input
                type="number"
                defaultValue="7.5"
                step="0.1"
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-xs font-bold outline-none focus:ring-1 focus:ring-black transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest px-1">Shipping (Lagos) ₦</label>
                <input
                  type="number"
                  defaultValue="3000"
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-xs font-bold outline-none focus:ring-1 focus:ring-black transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest px-1">Shipping (Outside) ₦</label>
                <input
                  type="number"
                  defaultValue="7000"
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-xs font-bold outline-none focus:ring-1 focus:ring-black transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest px-1">Payment Gateway</label>
              <select className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-xs font-bold outline-none focus:ring-1 focus:ring-black transition-all appearance-none cursor-pointer">
                <option value="PAYSTACK">Paystack (Default)</option>
                <option value="FLUTTERWAVE">Flutterwave</option>
                <option value="NONE">Manual Checkout Only</option>
              </select>
            </div>
          </div>
        </div>

        {/* Operational Tools */}
        <div className="bg-white border border-zinc-200 rounded-[2.5rem] overflow-hidden shadow-sm">
          <div className="px-10 py-6 border-b border-zinc-100 bg-zinc-50/50 flex items-center gap-3">
            <Database className="w-5 h-5 text-zinc-400" />
            <h3 className="text-xs font-black uppercase tracking-widest italic">Operational Tools</h3>
          </div>
          <div className="p-10 space-y-6">
            <button
              onClick={onOpenBulkUpload}
              className="w-full flex items-center justify-between px-6 py-5 bg-white border border-zinc-200 rounded-2xl group hover:border-black transition-all"
            >
              <div className="text-left">
                <p className="text-[10px] font-black uppercase tracking-widest group-hover:text-black transition-colors">Bulk Data Ingestion</p>
                <p className="text-[8px] text-zinc-400 font-bold uppercase tracking-tight mt-0.5">Import CSV/JSON Datasets</p>
              </div>
              <Server className="w-4 h-4 text-zinc-300 group-hover:text-black transition-colors" />
            </button>

            <button className="w-full flex items-center justify-between px-6 py-5 bg-white border border-zinc-200 rounded-2xl group hover:border-black transition-all">
              <div className="text-left">
                <p className="text-[10px] font-black uppercase tracking-widest group-hover:text-black transition-colors">Flush Analytics Cache</p>
                <p className="text-[8px] text-zinc-400 font-bold uppercase tracking-tight mt-0.5">Clear visualization cache</p>
              </div>
              <RefreshCw className="w-4 h-4 text-zinc-300 group-hover:text-black transition-colors" />
            </button>

            <div className="p-6 bg-zinc-900 rounded-3xl text-white">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-4 h-4 text-green-500" />
                <p className="text-[10px] font-black uppercase tracking-widest">System Integrity</p>
              </div>
              <p className="text-[8px] text-zinc-400 font-bold uppercase tracking-widest mb-1">Encrypted Backups</p>
              <p className="text-[10px] font-black italic uppercase">Automated | 12m ago</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button className="flex items-center gap-3 bg-black text-white px-12 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl hover:bg-zinc-800 transition-all hover:scale-[1.02] active:scale-95">
          <Save className="w-4 h-4" />
          Synchronize Configuration
        </button>
      </div>
    </div>
  );
};

export default Settings;
