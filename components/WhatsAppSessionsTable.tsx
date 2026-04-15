import React, { useState } from 'react';
import { Smartphone, CheckCircle2, AlertCircle, RefreshCw, Trash2, PowerOff } from 'lucide-react';

export enum WABusinessSessionStatus {
    CONNECTED = 'CONNECTED',
    DISCONNECTED = 'DISCONNECTED',
    AWAITING_QR = 'AWAITING_QR'
}

export interface WABusinessSession {
    id: string; // Session UUID
    businessNumber: string; // E.g., +2348012345678
    brand: string; // e.g., TECH, MEDIA
    status: WABusinessSessionStatus;
    lastActive: string; // ISO String
    createdAt: string; // ISO String
}

const MOCK_SESSIONS: WABusinessSession[] = [
    { id: 'sess-8f192-1a', businessNumber: '+234 801 234 5678', brand: 'TECH', status: WABusinessSessionStatus.CONNECTED, lastActive: new Date().toISOString(), createdAt: new Date(Date.now() - 86400000 * 5).toISOString() },
    { id: 'sess-3e21z-9p', businessNumber: '+234 902 345 6789', brand: 'MEDIA', status: WABusinessSessionStatus.DISCONNECTED, lastActive: new Date(Date.now() - 3600000).toISOString(), createdAt: new Date(Date.now() - 86400000 * 12).toISOString() },
    { id: 'sess-0a91x-5c', businessNumber: '+234 703 456 7890', brand: 'BLXRK', status: WABusinessSessionStatus.AWAITING_QR, lastActive: new Date(Date.now() - 60000).toISOString(), createdAt: new Date(Date.now() - 120000).toISOString() },
];

const WhatsAppSessionsTable: React.FC = () => {
    const [sessions] = useState<WABusinessSession[]>(MOCK_SESSIONS);

    const getStatusColor = (status: WABusinessSessionStatus) => {
        switch (status) {
            case WABusinessSessionStatus.CONNECTED: return 'text-green-500 bg-green-50 border-green-200';
            case WABusinessSessionStatus.AWAITING_QR: return 'text-amber-500 bg-amber-50 border-amber-200';
            case WABusinessSessionStatus.DISCONNECTED: return 'text-red-500 bg-red-50 border-red-200';
        }
    };

    return (
        <div className="bg-white border border-zinc-200 rounded-[2.5rem] overflow-hidden shadow-sm mt-8">
            <div className="px-10 py-6 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
                <div>
                    <h3 className="text-xs font-black uppercase tracking-widest italic flex items-center gap-2">
                        <Smartphone className="w-4 h-4 text-zinc-400" />
                        Active Sessions
                    </h3>
                    <p className="text-[10px] text-zinc-400 font-medium uppercase tracking-widest mt-1">Manage device links & QR lifecycles</p>
                </div>
                <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-zinc-200 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-sm hover:bg-zinc-50 transition-colors">
                    <RefreshCw className="w-3 h-3" />
                    Refresh
                </button>
            </div>

            <div className="overflow-x-auto w-full">
                <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                        <tr className="bg-zinc-50/30 border-b border-zinc-100">
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-400">Account</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-400">Connection Status</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-400">System Trace</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-400 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                        {sessions.map(session => (
                            <tr key={session.id} className="group hover:bg-zinc-50/30 transition-colors">
                                <td className="px-8 py-5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-2xl bg-zinc-100 flexitems-center justify-center border border-zinc-200 flex items-center">
                                            <span className="text-[10px] font-black">{session.brand.substring(0, 2)}</span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-black">{session.brand}</p>
                                            <p className="text-[10px] text-zinc-400 font-mono tracking-tighter mt-0.5">{session.businessNumber}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-5">
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[8px] font-black uppercase tracking-widest ${getStatusColor(session.status)}`}>
                                        {session.status === WABusinessSessionStatus.CONNECTED && <CheckCircle2 className="w-3 h-3" />}
                                        {session.status === WABusinessSessionStatus.DISCONNECTED && <AlertCircle className="w-3 h-3" />}
                                        {session.status === WABusinessSessionStatus.AWAITING_QR && <RefreshCw className="w-3 h-3 animate-spin" />}
                                        {session.status}
                                    </span>
                                </td>
                                <td className="px-8 py-5">
                                    <div className="space-y-1 text-[9px] font-mono uppercase text-zinc-400">
                                        <p>ID: {session.id}</p>
                                        <p>Ping: {new Date(session.lastActive).toLocaleTimeString()}</p>
                                    </div>
                                </td>
                                <td className="px-8 py-5 text-right">
                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {session.status !== WABusinessSessionStatus.DISCONNECTED && (
                                            <button className="p-2 hover:bg-red-50 text-zinc-400 hover:text-red-500 rounded-lg transition-colors border border-transparent hover:border-red-100" title="Force Disconnect">
                                                <PowerOff className="w-4 h-4" />
                                            </button>
                                        )}
                                        <button className="p-2 hover:bg-zinc-100 text-zinc-400 hover:text-black rounded-lg transition-colors border border-transparent hover:border-zinc-200" title="Delete Session">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default WhatsAppSessionsTable;
