import React, { useState } from 'react';
import {
    MessageSquare,
    Settings,
    Shield,
    Zap,
    LayoutGrid,
    CheckCircle2,
    AlertCircle,
    Eye,
    EyeOff,
    Copy,
    Plus,
    Save,
    Trash2,
    Globe,
    Key,
    Smartphone
} from 'lucide-react';
import { Brand } from '../types';
import GenericModal from './modals/GenericModal';
import WhatsAppSessionsTable from './WhatsAppSessionsTable';
interface WhatsAppAccount {
    id: Brand;
    name: string;
    phone: string;
    status: 'connected' | 'disconnected' | 'pending';
    metaNumberId: string;
    lastSync: string;
}

const INITIAL_ACCOUNTS: WhatsAppAccount[] = [
    { id: 'TECH', name: '6te9 TECH Support', phone: '+234 801 234 5678', status: 'connected', metaNumberId: '298731002341XX', lastSync: '2 mins ago' },
    { id: 'MEDIA', name: '6te9 MEDIA Designs', phone: '+234 902 345 6789', status: 'connected', metaNumberId: '982736110292YY', lastSync: '15 mins ago' },
    { id: 'BLXRK', name: 'BLXRK Concierge', phone: '+234 703 456 7890', status: 'pending', metaNumberId: 'P-1827361009AA', lastSync: 'Never' },
];

const WhatsAppIntegration: React.FC = () => {
    const [accounts, setAccounts] = useState<WhatsAppAccount[]>(INITIAL_ACCOUNTS);
    const [activeTab, setActiveTab] = useState<Brand>('TECH');
    const [showKey, setShowKey] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isAdvancedModalOpen, setIsAdvancedModalOpen] = useState(false);

    const [newAccount, setNewAccount] = useState<Partial<WhatsAppAccount>>({
        id: 'TECH',
        status: 'pending'
    });

    const activeAccount = accounts.find(a => a.id === activeTab) || accounts[0];

    const obfuscateKey = (key: string) => {
        return showKey ? key : '••••••••••••••••••••••••••••';
    };

    const handleAddAccount = (e: React.FormEvent) => {
        e.preventDefault();
        const account: WhatsAppAccount = {
            ...newAccount as WhatsAppAccount,
            lastSync: 'Never'
        };
        setAccounts([...accounts, account]);
        setIsAddModalOpen(false);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-10">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                <div>
                    <h2 className="text-2xl font-black italic uppercase tracking-tighter">WhatsApp Business</h2>
                    <div className="flex items-center gap-2 mt-1">
                        <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest">Multi-Account Engine</p>
                        <span className="w-1 h-1 bg-zinc-200 rounded-full" />
                        <p className="text-[10px] text-zinc-300 font-bold uppercase tracking-widest">{activeAccount.name}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex gap-1 p-1 bg-zinc-100 rounded-xl">
                        {accounts.map(account => (
                            <button
                                key={account.id}
                                onClick={() => setActiveTab(account.id)}
                                className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === account.id ? 'bg-white shadow-sm text-black' : 'text-zinc-400 hover:text-zinc-600'
                                    }`}
                            >
                                {account.id}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="p-2.5 bg-black text-white rounded-xl hover:bg-zinc-800 transition-all shadow-lg"
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-3 space-y-8">
                    <div className="bg-zinc-50 border border-zinc-100 rounded-[2.5rem] p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white rounded-2xl border border-zinc-200 flex items-center justify-center shadow-sm">
                                <Zap className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                            </div>
                            <div>
                                <h3 className="text-sm font-black italic uppercase tracking-tighter">Real-time Synchronization</h3>
                                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-0.5">Heartbeat received {activeAccount.lastSync}</p>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <div className="px-6 py-4 bg-white border border-zinc-100 rounded-2xl shadow-sm min-w-[100px]">
                                <p className="text-[8px] font-black text-zinc-300 uppercase tracking-widest mb-1 text-center">Messages</p>
                                <p className="text-lg font-black italic tracking-tighter text-center">{activeAccount.status === 'connected' ? '1.2k' : '0'}</p>
                            </div>
                            <div className="px-6 py-4 bg-white border border-zinc-100 rounded-2xl shadow-sm min-w-[100px]">
                                <p className="text-[8px] font-black text-zinc-300 uppercase tracking-widest mb-1 text-center">Latency</p>
                                <p className={`text-lg font-black italic tracking-tighter text-center ${activeAccount.status === 'connected' ? 'text-green-500' : 'text-zinc-300'}`}>
                                    {activeAccount.status === 'connected' ? '14ms' : '--'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-zinc-200 rounded-[2.5rem] overflow-hidden min-h-[400px] flex flex-col shadow-sm">
                        <div className="px-10 py-6 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/30">
                            <div className="flex items-center gap-3">
                                <MessageSquare className="w-4 h-4 text-zinc-400" />
                                <h3 className="text-[10px] font-black uppercase tracking-widest italic text-zinc-500">Live Interaction Stream</h3>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${activeAccount.status === 'connected' ? 'bg-green-500 animate-pulse' : 'bg-zinc-200'}`} />
                                <span className="text-[8px] font-black uppercase tracking-widest text-zinc-400">
                                    {activeAccount.status === 'connected' ? 'Listening...' : 'Stream Passive'}
                                </span>
                            </div>
                        </div>
                        <div className="flex-1 flex flex-col items-center justify-center py-20 text-center opacity-40">
                            <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mb-4 border border-zinc-100">
                                <LayoutGrid className="w-6 h-6 text-zinc-300" />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 italic">No incoming requests for {activeAccount.id}</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white border border-zinc-100 rounded-[2.5rem] p-8 shadow-sm space-y-8">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Shield className="w-5 h-5 text-zinc-300" />
                                <div className={`flex items-center gap-2 px-2 py-1 rounded-lg ${activeAccount.status === 'connected' ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'
                                    }`}>
                                    <span className="text-[8px] font-black uppercase tracking-tighter">{activeAccount.status}</span>
                                </div>
                            </div>
                            <div>
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">Business Line</h4>
                                <p className="text-xs font-bold leading-tight">{activeAccount.name}</p>
                                <p className="text-[10px] font-mono text-zinc-400 mt-1">{activeAccount.phone}</p>
                            </div>
                        </div>

                        <div className="pt-8 border-t border-zinc-50 space-y-6">
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">API Gateway</h4>
                                    <div className="flex gap-1">
                                        <button
                                            onClick={() => setShowKey(!showKey)}
                                            className="p-1 hover:bg-zinc-50 rounded transition-colors text-zinc-300 hover:text-black"
                                        >
                                            {showKey ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                                        </button>
                                        <button className="p-1 hover:bg-zinc-50 rounded transition-colors text-zinc-300 hover:text-black">
                                            <Copy className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>
                                <div className="px-3 py-2 bg-zinc-50 rounded-lg border border-zinc-100 overflow-hidden">
                                    <p className="text-[9px] font-mono text-zinc-400 break-all leading-relaxed tracking-tighter">
                                        {obfuscateKey(activeAccount.metaNumberId)}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <button className="w-full py-3 bg-zinc-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-md">
                                    Rotate Keys
                                </button>
                                <button
                                    onClick={() => setIsAdvancedModalOpen(true)}
                                    className="w-full py-3 bg-white border border-zinc-200 text-black rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-zinc-50 transition-all flex items-center justify-center gap-2"
                                >
                                    <Settings className="w-3 h-3" />
                                    Advanced Config
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-zinc-900 rounded-[2.5rem] p-8 text-white space-y-4 shadow-xl relative overflow-hidden group">
                        <div className="absolute right-0 top-0 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-all" />
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-white/40">Quick Support</h4>
                        <p className="text-xs font-medium leading-relaxed italic opacity-80">"Need help with API rate limits or webhook endpoint integration?"</p>
                        <button className="text-[9px] font-black uppercase tracking-widest border-b border-white/20 hover:border-white transition-all pb-0.5">Contact Dev Support</button>
                    </div>
                </div>
            </div>

            <WhatsAppSessionsTable />

            {/* Add Account Modal */}
            <GenericModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title="Add Business Line"
                footer={(
                    <>
                        <button
                            onClick={() => setIsAddModalOpen(false)}
                            className="flex-1 px-4 py-4 bg-zinc-100 text-zinc-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-200 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleAddAccount}
                            className="flex-[2] px-4 py-4 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-xl flex items-center justify-center gap-2"
                        >
                            <Save className="w-4 h-4" />
                            Provision Account
                        </button>
                    </>
                )}
            >
                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-1">Account Target</label>
                            <select
                                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-xs font-bold outline-none focus:ring-1 focus:ring-black transition-all appearance-none"
                                value={newAccount.id}
                                onChange={e => setNewAccount({ ...newAccount, id: e.target.value as Brand })}
                            >
                                <option value="TECH">TECH</option>
                                <option value="MEDIA">MEDIA</option>
                                <option value="BLXRK">BLXRK</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-1">Display Name</label>
                            <input
                                placeholder="e.g. 6te9 Support"
                                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-xs font-bold outline-none focus:ring-1 focus:ring-black transition-all"
                                value={newAccount.name}
                                onChange={e => setNewAccount({ ...newAccount, name: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-1">Business Phone</label>
                        <input
                            placeholder="+234..."
                            className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-xs font-bold outline-none focus:ring-1 focus:ring-black transition-all"
                            value={newAccount.phone}
                            onChange={e => setNewAccount({ ...newAccount, phone: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-1">Meta Number ID</label>
                        <input
                            type="text"
                            placeholder="e.g. 1029384756..."
                            className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-xs font-bold outline-none focus:ring-1 focus:ring-black transition-all"
                            value={newAccount.metaNumberId}
                            onChange={e => setNewAccount({ ...newAccount, metaNumberId: e.target.value })}
                        />
                    </div>
                </div>
            </GenericModal>

            {/* Advanced Config Modal */}
            <GenericModal
                isOpen={isAdvancedModalOpen}
                onClose={() => setIsAdvancedModalOpen(false)}
                title="Technical Integration"
                width="max-w-2xl"
            >
                <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <Globe className="w-4 h-4 text-zinc-400" />
                                <h4 className="text-[10px] font-black uppercase tracking-widest">Webhook Endpoint</h4>
                            </div>
                            <div className="p-4 bg-zinc-50 border border-zinc-100 rounded-2xl">
                                <code className="text-[10px] text-zinc-600 break-all">https://api.6te9.admin/whatsapp/webhook/{activeAccount.id.toLowerCase()}</code>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <Key className="w-4 h-4 text-zinc-400" />
                                <h4 className="text-[10px] font-black uppercase tracking-widest">Verify Token</h4>
                            </div>
                            <div className="p-4 bg-zinc-50 border border-zinc-100 rounded-2xl">
                                <code className="text-[10px] text-zinc-600 font-mono">6TE9_VERIFY_{activeAccount.id}</code>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 bg-zinc-900 rounded-3xl text-white">
                        <div className="flex items-center gap-3 mb-4">
                            <Smartphone className="w-5 h-5 text-green-500" />
                            <h4 className="text-[10px] font-black uppercase tracking-widest">Certificate Status</h4>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-1">
                                <p className="text-[8px] text-white/40 uppercase font-black">SSL Cert</p>
                                <p className="text-[10px] font-bold text-green-500">Valid</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[8px] text-white/40 uppercase font-black">Meta Link</p>
                                <p className="text-[10px] font-bold text-green-500">Verified</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[8px] text-white/40 uppercase font-black">TTL</p>
                                <p className="text-[10px] font-bold">142 Days</p>
                            </div>
                        </div>
                    </div>
                </div>
            </GenericModal>
        </div>
    );
};

export default WhatsAppIntegration;
