
import React, { useState, useRef } from 'react';
import { X, Save, Plus, Upload, Trash, Image as ImageIcon } from 'lucide-react';
import {
  MarketplaceCategory,
  MarketplaceItem,
  ItemStatus,
} from '../../types';
import {
  CATEGORY_FILTERS,
  TECH_TYPES,
  TECH_CONDITIONS,
  CULINARY_CUISINES,
  CULINARY_DIETARY,
  SPICE_LEVELS
} from '../../constants';

interface ItemFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: MarketplaceItem) => void;
  initialData?: MarketplaceItem | null;
  defaultMarketplace: MarketplaceCategory;
}

const ItemForm: React.FC<ItemFormProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  defaultMarketplace
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<Partial<MarketplaceItem>>(
    initialData || {
      id: Math.random().toString(36).substr(2, 9),
      marketplace: defaultMarketplace,
      status: ItemStatus.DRAFT,
      name: '',
      sku: '',
      price: 0,
      description: '',
      categories: [],
      images: [],
      isOffer: false,
      availabilityStatus: 'In Stock',
      audit: {
        createdAt: new Date().toISOString(),
        createdBy: 'Admin',
        updatedAt: new Date().toISOString(),
        updatedBy: 'Admin'
      }
    }
  );

  const [currentCat, setCurrentCat] = useState<MarketplaceCategory>(
    initialData?.marketplace || defaultMarketplace
  );

  const handleSharedChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'number' ? parseFloat(value) : value;
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // In a real app, upload to S3/Cloudinary and get URLs
      // For this UI, we'll simulate by creating a local preview URL
      const newUrls = Array.from(files).map(file => URL.createObjectURL(file as any));
      setFormData(prev => ({
        ...prev,
        images: [...(prev.images || []), ...newUrls]
      }));
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: (prev.images || []).filter((_, i) => i !== index)
    }));
  };

  const toggleCategory = (cat: string) => {
    const categories = formData.categories || [];
    if (categories.includes(cat)) {
      setFormData(prev => ({ ...prev, categories: categories.filter(c => c !== cat) }));
    } else {
      setFormData(prev => ({ ...prev, categories: [...categories, cat] }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      marketplace: currentCat,
      audit: {
        ...formData.audit!,
        updatedAt: new Date().toISOString()
      }
    } as MarketplaceItem);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col relative z-10 border border-zinc-200 animate-in zoom-in-95 duration-200">
        <div className="px-8 py-6 border-b border-zinc-100 flex items-center justify-between bg-white">
          <div>
            <h3 className="text-xl font-black italic uppercase tracking-tighter">
              {initialData ? 'Modify Catalog Entry' : 'New Catalog Entry'}
            </h3>
            <p className="text-[10px] text-zinc-400 font-black uppercase tracking-widest mt-1">
              {currentCat} SPECIFICATION ENGINE
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-zinc-100 rounded-xl transition-colors">
            <X className="w-5 h-5 text-zinc-400 hover:text-black" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 no-scrollbar bg-zinc-50/20">
          <div className="space-y-12">
            {!initialData && (
              <section>
                <p className="text-[10px] font-black text-zinc-300 uppercase tracking-widest mb-4">Vertical Assignment</p>
                <div className="grid grid-cols-3 gap-4">
                  {[MarketplaceCategory.TECH, MarketplaceCategory.MEDIA, MarketplaceCategory.CULINARY].map(m => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setCurrentCat(m)}
                      className={`py-4 px-6 rounded-2xl border-2 font-black uppercase tracking-tight text-sm transition-all ${currentCat === m
                        ? 'border-black bg-black text-white shadow-xl shadow-zinc-200'
                        : 'border-zinc-100 bg-white text-zinc-300 hover:border-zinc-200 hover:text-zinc-500'
                        }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </section>
            )}

            {/* Media Gallery Section */}
            <section className="space-y-4">
              <p className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Product Media Assets</p>
              <div className="grid grid-cols-4 gap-4">
                {formData.images?.map((url, idx) => (
                  <div key={idx} className="relative aspect-square bg-zinc-100 rounded-2xl border border-zinc-200 overflow-hidden group">
                    <img src={url} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-2 right-2 p-1.5 bg-black text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity active:scale-90"
                    >
                      <Trash className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-zinc-200 rounded-2xl hover:border-black transition-all bg-white group"
                >
                  <Plus className="w-6 h-6 text-zinc-300 group-hover:text-black mb-1 transition-colors" />
                  <span className="text-[8px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-black">Add Asset</span>
                  <input
                    type="file"
                    multiple
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    className="hidden"
                    accept="image/*"
                  />
                </button>
              </div>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-6">
                <p className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Core Metadata</p>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Legal Product Name</label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleSharedChange}
                    required
                    className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-xl font-bold focus:ring-1 focus:ring-black outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">SKU Reference</label>
                    <input
                      name="sku"
                      value={formData.sku}
                      onChange={handleSharedChange}
                      className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-xl font-mono text-sm focus:ring-1 focus:ring-black outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Retail Price (₦)</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleSharedChange}
                      required
                      className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-xl font-black focus:ring-1 focus:ring-black outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-6 p-5 bg-white border border-zinc-200 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={formData.isOffer}
                      onChange={(e) => setFormData(prev => ({ ...prev, isOffer: e.target.checked }))}
                      className="w-5 h-5 accent-black rounded"
                    />
                    <label className="text-sm font-black uppercase tracking-tight">Active Promo</label>
                  </div>
                  {formData.isOffer && (
                    <div className="flex-1 animate-in slide-in-from-left-2 duration-200">
                      <input
                        type="number"
                        placeholder="Strike-through Price (₦)"
                        value={formData.salePrice || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, salePrice: parseFloat(e.target.value) }))}
                        className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-black"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <p className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Inventory Logistics</p>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Extended Narrative</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleSharedChange}
                    rows={4}
                    className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-xl font-medium focus:ring-1 focus:ring-black outline-none transition-all resize-none text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">System Workflow State</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleSharedChange}
                    className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-xl font-black uppercase tracking-widest text-xs focus:ring-1 focus:ring-black outline-none transition-all"
                  >
                    <option value={ItemStatus.DRAFT}>Draft (Offline)</option>
                    <option value={ItemStatus.PUBLISHED}>Published (Live)</option>
                    <option value={ItemStatus.ARCHIVED}>Archived (Legacy)</option>
                  </select>
                </div>
              </div>
            </section>

            <section>
              <p className="text-[10px] font-black text-zinc-300 uppercase tracking-widest mb-4">Attribute Tags (Cross-filtering)</p>
              <div className="flex flex-wrap gap-2">
                {CATEGORY_FILTERS[currentCat].map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleCategory(tag)}
                    className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${formData.categories?.includes(tag)
                      ? 'bg-black text-white border-black shadow-lg shadow-zinc-200'
                      : 'bg-white text-zinc-300 border-zinc-100 hover:border-zinc-200 hover:text-zinc-500'
                      }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </section>

            <section className="bg-white border border-zinc-200 rounded-3xl p-8 space-y-10 shadow-sm">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
                <p className="text-[10px] font-black text-black uppercase tracking-widest italic">{currentCat} TECHNICAL MANIFEST</p>
                <span className="p-1 bg-zinc-50 rounded text-[8px] font-bold text-zinc-400">CATEGORY-SPECIFIC VALIDATION ACTIVE</span>
              </div>

              {currentCat === MarketplaceCategory.TECH && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-zinc-500">Manufacturer</label>
                      <input className="w-full px-4 py-3 bg-zinc-50 rounded-xl border border-zinc-100 font-bold" placeholder="e.g. Apple" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-zinc-500">Hardware Class</label>
                      <select className="w-full px-4 py-3 bg-zinc-50 rounded-xl border border-zinc-100 font-bold">
                        {TECH_TYPES.map(t => <option key={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-zinc-500">Operational Condition</label>
                      <select className="w-full px-4 py-3 bg-zinc-50 rounded-xl border border-zinc-100 font-bold">
                        {TECH_CONDITIONS.map(c => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="flex items-center gap-4 py-3 px-4 bg-zinc-50 rounded-xl border border-zinc-100">
                      <input type="checkbox" className="w-4 h-4 accent-black" />
                      <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Extended Warranty Support</label>
                    </div>
                  </div>
                </div>
              )}

              {currentCat === MarketplaceCategory.CULINARY && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-zinc-500">Global Cuisine Origin</label>
                      <select className="w-full px-4 py-3 bg-zinc-50 rounded-xl border border-zinc-100 font-bold">
                        {CULINARY_CUISINES.map(t => <option key={t}>{t}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-zinc-500">Scoville/Spice Rating</label>
                      <select className="w-full px-4 py-3 bg-zinc-50 rounded-xl border border-zinc-100 font-bold">
                        {SPICE_LEVELS.map(s => <option key={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-zinc-500">Composition (Ingredients List)</label>
                      <textarea className="w-full px-4 py-3 bg-zinc-50 rounded-xl border border-zinc-100 text-sm font-medium h-32" placeholder="CSV format: Flour, Sugar, Water..." />
                    </div>
                  </div>
                </div>
              )}

              {currentCat === MarketplaceCategory.MEDIA && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-zinc-500">Primary Substrate/Material</label>
                      <input className="w-full px-4 py-3 bg-zinc-50 rounded-xl border border-zinc-100 font-bold" placeholder="e.g. 300gsm Cotton" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-zinc-500">Client Personalization</label>
                      <select className="w-full px-4 py-3 bg-zinc-50 rounded-xl border border-zinc-100 font-bold uppercase tracking-widest text-xs">
                        <option>Enabled</option>
                        <option>Disabled</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-zinc-500">Standard Fulfillment Loop (Days)</label>
                      <input type="number" className="w-full px-4 py-3 bg-zinc-50 rounded-xl border border-zinc-100 font-black" defaultValue={7} />
                    </div>
                  </div>
                </div>
              )}
            </section>
          </div>
        </form>

        <div className="px-8 py-6 border-t border-zinc-100 flex items-center justify-between bg-zinc-50/50">
          <div className="flex items-center gap-4 text-[10px] text-zinc-300 font-black uppercase tracking-widest">
            <span className="flex items-center gap-1.5"><Save className="w-3 h-3" /> Auto-sync Active</span>
            <span className="w-1 h-1 bg-zinc-200 rounded-full"></span>
            <span className="flex items-center gap-1.5">Encryption Level: HIGH</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-black hover:bg-white transition-all"
            >
              Discard Changes
            </button>
            <button
              onClick={handleSubmit}
              className="bg-black text-white px-10 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-200 active:scale-95 flex items-center gap-3"
            >
              <Save className="w-4 h-4" />
              {initialData ? 'Synchronize Record' : 'Commit New Record'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemForm;
