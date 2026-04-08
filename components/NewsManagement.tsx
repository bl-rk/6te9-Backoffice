import React from 'react';
import { Newspaper, Plus, Trash, Calendar } from 'lucide-react';
import { NewsOffer } from '../types';

const MOCK_NEWS: NewsOffer[] = [
    { id: '1', title: 'Easter Tech Blowout', offerInfo: 'Get up to 40% off all Apple accessories and peripherals.', validityPeriod: 'April 1 - April 15, 2026', createdAt: new Date().toISOString() },
    { id: '2', title: 'New Culinary Arrivals', offerInfo: 'Discover our latest intercontinental spice blends from the Mediterranean.', validityPeriod: 'Ongoing', createdAt: new Date().toISOString() },
];

const NewsManagement: React.FC = () => {
    const [posts, setPosts] = React.useState<NewsOffer[]>(MOCK_NEWS);
    const [isAdding, setIsAdding] = React.useState(false);
    const [newPost, setNewPost] = React.useState<Partial<NewsOffer>>({
        title: '',
        offerInfo: '',
        validityPeriod: ''
    });

    const handleAdd = () => {
        if (!newPost.title || !newPost.offerInfo) return;
        const post: NewsOffer = {
            id: Math.random().toString(36).substr(2, 9),
            title: newPost.title,
            offerInfo: newPost.offerInfo,
            validityPeriod: newPost.validityPeriod || 'Permanent',
            createdAt: new Date().toISOString()
        };
        setPosts([post, ...posts]);
        setIsAdding(false);
        setNewPost({ title: '', offerInfo: '', validityPeriod: '' });
    };

    const deletePost = (id: string) => {
        if (confirm('Delete this broadcast?')) {
            setPosts(prev => prev.filter(p => p.id !== id));
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black italic uppercase tracking-tighter">News & Offers</h2>
                    <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest mt-1">Broadcast Management Engine</p>
                </div>
                <button
                    onClick={() => setIsAdding(true)}
                    className="bg-black text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-xl flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Create Broadcast
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isAdding && (
                    <div className="bg-zinc-50 border-2 border-dashed border-zinc-200 rounded-3xl p-6 space-y-4 animate-in zoom-in-95">
                        <input
                            placeholder="Broadcast Title"
                            className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-xl text-xs font-black uppercase tracking-widest outline-none focus:ring-1 focus:ring-black"
                            value={newPost.title}
                            onChange={e => setNewPost({ ...newPost, title: e.target.value })}
                        />
                        <textarea
                            placeholder="Offer Information / Content"
                            className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-xl text-xs font-bold outline-none focus:ring-1 focus:ring-black h-24 resize-none"
                            value={newPost.offerInfo}
                            onChange={e => setNewPost({ ...newPost, offerInfo: e.target.value })}
                        />
                        <input
                            placeholder="Validity Period (e.g. 2 weeks)"
                            className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-xl text-[10px] font-bold outline-none focus:ring-1 focus:ring-black"
                            value={newPost.validityPeriod}
                            onChange={e => setNewPost({ ...newPost, validityPeriod: e.target.value })}
                        />
                        <div className="flex gap-2">
                            <button
                                onClick={handleAdd}
                                className="flex-1 py-3 bg-black text-white rounded-xl text-[10px] font-black uppercase tracking-widest"
                            >
                                Commit
                            </button>
                            <button
                                onClick={() => setIsAdding(false)}
                                className="px-4 py-3 bg-zinc-200 text-zinc-500 rounded-xl text-[10px] font-black uppercase tracking-widest"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                {posts.map(post => (
                    <div key={post.id} className="bg-white border border-zinc-200 rounded-3xl p-8 flex flex-col justify-between hover:shadow-xl transition-all group">
                        <div className="space-y-4">
                            <div className="flex items-start justify-between">
                                <div className="w-10 h-10 bg-zinc-50 rounded-2xl flex items-center justify-center">
                                    <Newspaper className="w-5 h-5 text-black" />
                                </div>
                                <button
                                    onClick={() => deletePost(post.id)}
                                    className="p-2 opacity-0 group-hover:opacity-100 text-zinc-300 hover:text-red-500 transition-all"
                                >
                                    <Trash className="w-4 h-4" />
                                </button>
                            </div>
                            <div>
                                <h3 className="text-sm font-black uppercase tracking-tight italic">{post.title}</h3>
                                <p className="text-[10px] text-zinc-400 font-mono mt-1">{new Date(post.createdAt).toLocaleDateString()}</p>
                            </div>
                            <p className="text-xs text-zinc-500 font-medium leading-relaxed">{post.offerInfo}</p>
                        </div>

                        <div className="mt-8 pt-6 border-t border-zinc-50 flex items-center gap-3">
                            <Calendar className="w-3 h-3 text-zinc-300" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Valid: {post.validityPeriod}</span>
                        </div>
                    </div>
                ))}
            </div>

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
