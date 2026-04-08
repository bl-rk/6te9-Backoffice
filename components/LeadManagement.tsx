import React, { useState } from 'react';
import {
    Users,
    Plus,
    Mail,
    Phone,
    Info,
    ChevronRight,
    ChevronLeft,
    Edit2,
    X,
    Save,
    Trash2,
    Download
} from 'lucide-react';
import { LeadStage, Lead, Brand } from '../types';
import { BRANDS } from '../constants';
import BulkUploadModal from './modals/BulkUploadModal';

const MOCK_LEADS: Lead[] = [
    { id: '1', mobile: '+234 801 234 5678', email: 'john@example.com', brand: 'TECH', category: 'Laptops', stage: LeadStage.INGESTION, info: 'Interested in bulk purchase of MacBooks', createdAt: new Date().toISOString() },
    { id: '2', mobile: '+234 902 345 6789', email: 'sarah@design.co', brand: 'MEDIA', category: 'Printing', stage: LeadStage.CONTACTED, info: 'Inquired about large format banners', createdAt: new Date().toISOString() },
    { id: '3', mobile: '+234 703 456 7890', email: 'mike@blxrk.com', brand: 'BLXRK', category: 'Real Estate', stage: LeadStage.FOLLOW_UP, info: 'Sent property portfolio, waiting for feedback', createdAt: new Date().toISOString() },
];

const LeadManagement: React.FC = () => {
    const [leads, setLeads] = useState<Lead[]>(MOCK_LEADS);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
    const [editingLead, setEditingLead] = useState<Lead | null>(null);
    const [formData, setFormData] = useState<Partial<Lead>>({});

    const stages = Object.values(LeadStage);

    const downloadLeadTemplate = () => {
        const csvContent = "Mobile,Email,Brand,Category,Info\n+2348000000000,example@brand.com,TECH,Laptops,Bulk inquiry for office setup";
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = "6te9_leads_template.csv";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const openModal = (lead: Lead | null = null) => {
        setEditingLead(lead);
        setFormData(lead || {
            mobile: '',
            email: '',
            brand: 'TECH' as Brand,
            category: '',
            stage: LeadStage.INGESTION,
            info: ''
        });
        setIsModalOpen(true);
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingLead) {
            setLeads(prev => prev.map(l => l.id === editingLead.id ? { ...l, ...formData } as Lead : l));
        } else {
            const newLead: Lead = {
                ...formData as Lead,
                id: Math.random().toString(36).substr(2, 9),
                createdAt: new Date().toISOString()
            };
            setLeads(prev => [newLead, ...prev]);
        }
        setIsModalOpen(false);
    };

    const moveLead = (id: string, direction: 'forward' | 'backward') => {
        setLeads(prev => prev.map(l => {
            if (l.id !== id) return l;
            const currentIndex = stages.indexOf(l.stage);
            const nextIndex = direction === 'forward' ? currentIndex + 1 : currentIndex - 1;
            if (nextIndex >= 0 && nextIndex < stages.length) {
                return { ...l, stage: stages[nextIndex] };
            }
            return l;
        }));
    };

    const deleteLead = (id: string) => {
        if (confirm('Delete this lead permanently?')) {
            setLeads(prev => prev.filter(l => l.id !== id));
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                <div>
                    <h2 className="text-2xl font-black italic uppercase tracking-tighter">Lead Funnel</h2>
                    <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest mt-1">Relationship & Conversion Pipeline</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => openModal()}
                        className="flex items-center gap-2 px-6 py-2.5 bg-black text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-xl"
                    >
                        <Plus className="w-4 h-4" />
                        Manual Ingestion
                    </button>
                    <button
                        onClick={() => setIsBulkModalOpen(true)}
                        className="flex items-center gap-2 px-6 py-2.5 bg-white border border-zinc-200 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-zinc-50 transition-all"
                    >
                        <Download className="w-4 h-4" />
                        Bulk Import
                    </button>
                    <button
                        onClick={downloadLeadTemplate}
                        className="flex items-center gap-2 px-6 py-2.5 border border-zinc-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-black hover:bg-zinc-50 transition-all"
                    >
                        Download Schema
                    </button>
                </div>
            </div>

            {/* Kanban Board */}
            <div className="flex gap-6 overflow-x-auto pb-6 no-scrollbar min-h-[70vh]">
                {stages.map(stage => (
                    <div key={stage} className="flex-shrink-0 w-80 bg-zinc-50/50 rounded-[2.5rem] border border-zinc-100 flex flex-col">
                        <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-black/40 italic">{stage}</h3>
                            <span className="px-2 py-0.5 rounded-full bg-white border border-zinc-100 text-[10px] font-black">{leads.filter(l => l.stage === stage).length}</span>
                        </div>
                        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                            {leads.filter(l => l.stage === stage).map(lead => (
                                <div key={lead.id} className="bg-white p-5 rounded-3xl border border-zinc-100 shadow-sm hover:shadow-md transition-all group relative">
                                    <div className="flex items-start justify-between mb-4">
                                        <span className="px-2 py-0.5 bg-zinc-100 rounded text-[8px] font-black uppercase tracking-tighter">{lead.brand}</span>
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() => openModal(lead)}
                                                className="p-1.5 hover:bg-zinc-50 rounded-lg text-zinc-300 hover:text-black transition-colors"
                                            >
                                                <Edit2 className="w-3 h-3" />
                                            </button>
                                            <button
                                                onClick={() => deleteLead(lead.id)}
                                                className="p-1.5 hover:bg-zinc-50 rounded-lg text-zinc-300 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 text-zinc-500">
                                            <Phone className="w-3 h-3" />
                                            <p className="text-[10px] font-bold">{lead.mobile}</p>
                                        </div>
                                        <div className="flex items-center gap-2 text-zinc-500">
                                            <Mail className="w-3 h-3" />
                                            <p className="text-[10px] font-bold truncate">{lead.email}</p>
                                        </div>
                                        <div className="pt-3 border-t border-zinc-50">
                                            <div className="flex items-start gap-2">
                                                <Info className="w-3 h-3 text-zinc-300 mt-0.5" />
                                                <p className="text-[10px] text-zinc-400 font-medium leading-relaxed italic line-clamp-2">{lead.info}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Bidirectional Movement */}
                                    <div className="mt-4 pt-4 border-t border-zinc-50 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            disabled={stages.indexOf(stage) === 0}
                                            onClick={() => moveLead(lead.id, 'backward')}
                                            className="p-1.5 hover:bg-zinc-50 rounded-lg text-black transition-colors disabled:opacity-10"
                                        >
                                            <ChevronLeft className="w-4 h-4" />
                                        </button>
                                        <p className="text-[8px] font-black uppercase tracking-widest text-zinc-300">Update Stage</p>
                                        <button
                                            disabled={stages.indexOf(stage) === stages.length - 1}
                                            onClick={() => moveLead(lead.id, 'forward')}
                                            className="p-1.5 hover:bg-zinc-50 rounded-lg text-black transition-colors disabled:opacity-10"
                                        >
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {leads.filter(l => l.stage === stage).length === 0 && (
                                <div className="py-20 text-center">
                                    <Users className="w-8 h-8 text-zinc-100 mx-auto mb-2" />
                                    <p className="text-[8px] font-black uppercase tracking-widest text-zinc-300">Station Empty</p>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Manual Ingestion / Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
                    <form
                        onSubmit={handleSave}
                        className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden relative z-10 border border-zinc-200 animate-in zoom-in-95 duration-200"
                    >
                        <div className="px-8 py-6 border-b border-zinc-100 flex items-center justify-between">
                            <h3 className="text-xl font-black italic uppercase tracking-tighter">
                                {editingLead ? 'Update Lead' : 'Manual Ingestion'}
                            </h3>
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 hover:bg-zinc-100 rounded-xl transition-all"
                            >
                                <X className="w-5 h-5 text-zinc-400" />
                            </button>
                        </div>

                        <div className="p-8 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-1">Mobile Number</label>
                                    <input
                                        required
                                        type="tel"
                                        placeholder="+234..."
                                        className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-xs font-bold outline-none focus:ring-1 focus:ring-black transition-all"
                                        value={formData.mobile}
                                        onChange={e => setFormData({ ...formData, mobile: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-1">Email Address</label>
                                    <input
                                        required
                                        type="email"
                                        placeholder="email@example.com"
                                        className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-xs font-bold outline-none focus:ring-1 focus:ring-black transition-all"
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-1">Target Brand</label>
                                    <select
                                        className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-xs font-bold outline-none focus:ring-1 focus:ring-black transition-all appearance-none"
                                        value={formData.brand}
                                        onChange={e => setFormData({ ...formData, brand: e.target.value as Brand })}
                                    >
                                        {BRANDS.map(brand => <option key={brand} value={brand}>{brand}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-1">Category / Interest</label>
                                    <input
                                        required
                                        placeholder="e.g. Real Estate"
                                        className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-xs font-bold outline-none focus:ring-1 focus:ring-black transition-all"
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-1">Additional Information</label>
                                <textarea
                                    placeholder="Lead requirements, initial interaction notes..."
                                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-xs font-bold outline-none focus:ring-1 focus:ring-black transition-all h-24 resize-none"
                                    value={formData.info}
                                    onChange={e => setFormData({ ...formData, info: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="p-8 border-t border-zinc-100 flex gap-3">
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="flex-1 px-4 py-4 bg-zinc-100 text-zinc-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-200 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex-[2] px-4 py-4 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-xl flex items-center justify-center gap-2"
                            >
                                <Save className="w-4 h-4" />
                                {editingLead ? 'Update Manifest' : 'Commit Ingestion'}
                            </button>
                        </div>
                    </form>
                </div>
            )}
            {/* Bulk Upload Modal Integration */}
            <BulkUploadModal
                isOpen={isBulkModalOpen}
                onClose={() => setIsBulkModalOpen(false)}
                onUploadComplete={(count) => {
                    console.log(`Ingested ${count} leads`);
                    setIsBulkModalOpen(false);
                }}
            />
        </div>
    );
};

export default LeadManagement;
