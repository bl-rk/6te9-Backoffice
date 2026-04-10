import React, { useState } from 'react';
import { Newspaper, Plus, Trash, Calendar, Edit, Save, X, Tag } from 'lucide-react';
import { NewsOffer, MarketplaceCategory } from '../types';
import GenericConfirmModal from './modals/GenericConfirmModal';
import GenericModal from './modals/GenericModal';
import { broadcastService } from '../services/broadcastService';
import { useEffect } from 'react';

const NewsManagement: React.FC = () => {
    const [posts, setPosts] = React.useState<NewsOffer[]>([]);
    const [isAdding, setIsAdding] = useState(false);
    const [editingPost, setEditingPost] = useState<NewsOffer | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const [formState, setFormState] = useState<Partial<NewsOffer>>({
        title: '',
        offerInfo: '',
        category: MarketplaceCategory.TECH,
        validityPeriod: ''
    });

    useEffect(() => {
        fetchBroadcasts();
    }, []);

    const fetchBroadcasts = async () => {
        setLoading(true);
        try {
            const data = await broadcastService.getBroadcasts();
            setPosts(data);
        } catch (err) {
            console.error('Failed to fetch broadcasts:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!formState.title || !formState.offerInfo || !formState.category) return;

        try {
            const saved = await broadcastService.saveBroadcast({
                ...formState,
                id: editingPost?.id
            });

            if (editingPost) {
                setPosts(prev => prev.map(p => p.id === saved.id ? saved : p));
                setEditingPost(null);
            } else {
                setPosts([saved, ...posts]);
                setIsAdding(false);
            }
            setFormState({ title: '', offerInfo: '', category: MarketplaceCategory.TECH, validityPeriod: '' });
        } catch (err) {
            alert('Failed to synchronize broadcast with the marketplace engine.');
        }
    };

    const startEdit = (post: NewsOffer) => {
        setEditingPost(post);
        setFormState({
            title: post.title,
            offerInfo: post.offerInfo,
            category: post.category,
            validityPeriod: post.validityPeriod
        });
    };

    const confirmDelete = async () => {
        if (deletingId) {
            try {
                await broadcastService.deleteBroadcast(deletingId);
                setPosts(prev => prev.filter(p => p.id !== deletingId));
                setDeletingId(null);
            } catch (err) {
                alert('Failed to abolish broadcast record.');
            }
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black italic uppercase tracking-tighter">News & Offers</h2>
                    <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest mt-1">Broadcast Management Engine</p>
                </div>
                <button
                    onClick={() => {
                        setIsAdding(true);
                        setFormState({ title: '', offerInfo: '', category: MarketplaceCategory.TECH, validityPeriod: '' });
                    }}
                    className="bg-black text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-xl flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Create Broadcast
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map(post => (
                    <div key={post.id} className="bg-white border border-zinc-200 rounded-3xl p-8 flex flex-col justify-between hover:shadow-xl transition-all group h-full">
                        <div className="space-y-4">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-zinc-50 rounded-2xl flex items-center justify-center">
                                        <Newspaper className="w-5 h-5 text-black" />
                                    </div>
                                    <span className="px-2 py-1 bg-zinc-100 text-black text-[8px] font-black uppercase tracking-widest rounded-lg border border-zinc-200">
                                        {post.category}
                                    </span>
                                </div>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                    <button
                                        onClick={() => startEdit(post)}
                                        className="p-2 text-zinc-300 hover:text-black transition-all"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => setDeletingId(post.id)}
                                        className="p-2 text-zinc-300 hover:text-red-500 transition-all"
                                    >
                                        <Trash className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-sm font-black uppercase tracking-tight italic line-clamp-2 h-10">{post.title}</h3>
                                <p className="text-[10px] text-zinc-400 font-mono mt-1">{new Date(post.createdAt).toLocaleDateString()}</p>
                            </div>
                            <p className="text-xs text-zinc-500 font-medium leading-relaxed line-clamp-4 min-h-[5rem]">{post.offerInfo}</p>
                        </div>

                        <div className="mt-8 pt-6 border-t border-zinc-50 flex items-center gap-3">
                            <Calendar className="w-3 h-3 text-zinc-300" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Valid: {post.validityPeriod}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Creation / Edit Modal */}
            <GenericModal
                isOpen={isAdding || !!editingPost}
                onClose={() => {
                    setIsAdding(false);
                    setEditingPost(null);
                }}
                title={editingPost ? 'Modify Broadcast' : 'New Broadcast'}
                width="max-w-lg"
                footer={
                    <div className="flex gap-4 w-full">
                        <button
                            onClick={() => {
                                setIsAdding(false);
                                setEditingPost(null);
                            }}
                            className="flex-1 px-6 py-4 bg-zinc-100 text-zinc-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-200 transition-all"
                        >
                            Discard
                        </button>
                        <button
                            onClick={handleSave}
                            className="flex-[2] px-6 py-4 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-2"
                        >
                            <Save className="w-4 h-4" />
                            {editingPost ? 'Synchronize' : 'Commit Broadcast'}
                        </button>
                    </div>
                }
            >
                <div className="space-y-6 py-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Target Vertical</label>
                        <div className="grid grid-cols-3 gap-3">
                            {[MarketplaceCategory.TECH, MarketplaceCategory.MEDIA, MarketplaceCategory.CULINARY].map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setFormState({ ...formState, category: cat })}
                                    className={`py-3 rounded-xl border-2 text-[10px] font-black uppercase tracking-widest transition-all ${formState.category === cat
                                        ? 'border-black bg-black text-white shadow-lg'
                                        : 'border-zinc-100 bg-zinc-50 text-zinc-400 hover:border-zinc-200'}`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Headline / Title</label>
                        <input
                            placeholder="e.g. MEGA SUMMER SALE"
                            className="w-full px-5 py-4 bg-zinc-50 border border-zinc-100 rounded-xl text-xs font-black uppercase tracking-widest outline-none focus:ring-1 focus:ring-black"
                            value={formState.title}
                            onChange={e => setFormState({ ...formState, title: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Broadcast Content</label>
                        <textarea
                            placeholder="Detailed offer information..."
                            className="w-full px-5 py-4 bg-zinc-50 border border-zinc-100 rounded-xl text-xs font-bold outline-none focus:ring-1 focus:ring-black h-40 resize-none font-inter"
                            value={formState.offerInfo}
                            onChange={e => setFormState({ ...formState, offerInfo: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Validity Horizon</label>
                        <input
                            placeholder="e.g. End of April 2026"
                            className="w-full px-5 py-4 bg-zinc-50 border border-zinc-100 rounded-xl text-[10px] font-bold outline-none focus:ring-1 focus:ring-black"
                            value={formState.validityPeriod}
                            onChange={e => setFormState({ ...formState, validityPeriod: e.target.value })}
                        />
                    </div>
                </div>
            </GenericModal>

            {/* Deletion Confirmation */}
            <GenericConfirmModal
                isOpen={!!deletingId}
                onClose={() => setDeletingId(null)}
                onConfirm={confirmDelete}
                title="Abolish Broadcast"
                message="This will permanently propagate across the marketplace network. This action is irreversible."
                confirmLabel="Delete Broadcast"
            />

            {posts.length === 0 && !isAdding && (
                <div className="bg-white border border-zinc-200 rounded-2xl p-8 text-center py-20">
                    <Newspaper className="w-12 h-12 text-zinc-100 mx-auto mb-4" />
                    <p className="text-sm font-black uppercase tracking-widest text-zinc-300">No active broadcasts found</p>
                </div>
            )}
        </div>
    );
};

export default NewsManagement;
