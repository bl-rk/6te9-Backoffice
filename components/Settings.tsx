
import React from 'react';
import { Shield, Bell, Globe, Key, UserPlus, Database, Save, Server, FileText } from 'lucide-react';

interface SettingsProps {
  maintenanceMode: boolean;
  setMaintenanceMode: (val: boolean) => void;
  onOpenBulkUpload: () => void;
}

const Settings: React.FC<SettingsProps> = ({ maintenanceMode, setMaintenanceMode, onOpenBulkUpload }) => {
  const sections = [
    {
      title: 'Platform Config',
      icon: <Globe className="w-4 h-4" />,
      settings: [
        { label: 'Platform Name', value: '6te9 Marketplace', type: 'text' },
        { label: 'Base Currency', value: 'Naira (₦)', type: 'select', options: ['Naira (₦)', 'USD ($)', 'Euro (€)'] },
        { label: 'Public Registration', checked: true, type: 'toggle' },
      ]
    },
    {
      title: 'Security & Access',
      icon: <Shield className="w-4 h-4" />,
      settings: [
        { label: 'Two-Factor Auth', checked: true, type: 'toggle' },
        { label: 'Session Timeout', value: '30 Minutes', type: 'select', options: ['15 Min', '30 Min', '1 Hour', 'Never'] },
        { label: 'IP Whitelisting', checked: false, type: 'toggle' },
      ]
    },
    {
      title: 'Back-Office Tools',
      icon: <Database className="w-4 h-4" />,
      settings: [
        { label: 'Google Analytics ID', value: 'UA-90210-6TE9', type: 'text' },
        { label: 'Maintenance Mode', checked: maintenanceMode, type: 'maintenance-toggle' },
        { label: 'Data Ingestion', labelAction: 'Open Bulk Upload', action: onOpenBulkUpload, type: 'action' },
      ]
    }
  ];

  return (
    <div className="max-w-4xl space-y-8 animate-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map((section, idx) => (
          <div key={idx} className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-zinc-100 bg-zinc-50/50 flex items-center gap-2">
              <span className="p-1.5 bg-black text-white rounded-lg">{section.icon}</span>
              <h3 className="text-sm font-bold uppercase tracking-tight">{section.title}</h3>
            </div>
            <div className="p-6 space-y-6">
              {section.settings.map((s: any, sIdx) => (
                <div key={sIdx} className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{s.label}</label>
                    {(s.type === 'toggle' || s.type === 'maintenance-toggle') && (
                      <button 
                        onClick={() => s.type === 'maintenance-toggle' ? setMaintenanceMode(!maintenanceMode) : null}
                        className={`w-10 h-5 rounded-full transition-all relative ${s.checked ? 'bg-black' : 'bg-zinc-200'}`}
                      >
                        <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${s.checked ? 'left-5.5' : 'left-0.5'}`} style={{ left: s.checked ? '1.375rem' : '0.125rem'}}></span>
                      </button>
                    )}
                  </div>
                  {s.type === 'text' && (
                    <input type="text" defaultValue={s.value} className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm font-medium focus:ring-1 focus:ring-black outline-none" />
                  )}
                  {s.type === 'select' && (
                    <select className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm font-medium outline-none">
                      {s.options?.map((o: string) => <option key={o}>{o}</option>)}
                    </select>
                  )}
                  {s.type === 'action' && (
                    <button 
                      onClick={s.action}
                      className="w-full py-2 bg-white border border-zinc-200 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all"
                    >
                      {s.labelAction}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-black text-white p-8 rounded-3xl flex items-center justify-between shadow-2xl">
        <div className="flex items-center gap-6">
          <div className="p-4 bg-zinc-800 rounded-2xl">
            <Server className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold uppercase italic tracking-tighter">System Health & Ops</h3>
            <p className="text-zinc-400 text-xs mt-1 uppercase tracking-widest font-bold">Node Status: Active | Last Backup: 12m ago</p>
          </div>
        </div>
        <div className="flex gap-4">
          <button className="px-6 py-2.5 border border-zinc-700 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-zinc-900 transition-all">
            Flush Cache
          </button>
          <button className="px-6 py-2.5 bg-white text-black rounded-xl text-xs font-black uppercase tracking-widest hover:bg-zinc-200 transition-all">
            Reboot Node
          </button>
        </div>
      </div>
      
      <div className="flex justify-end pt-4">
        <button className="flex items-center gap-3 bg-black text-white px-10 py-4 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl hover:bg-zinc-800 transition-all active:scale-95">
          <Save className="w-4 h-4" />
          Synchronize Configuration
        </button>
      </div>
    </div>
  );
};

export default Settings;
