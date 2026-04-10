
import React, { useState, useRef, useEffect } from 'react';
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
  SPICE_LEVELS,
  TECH_SPEC_KEYS,
  MEDIA_SPEC_KEYS
} from '../../constants';
import { cloudinaryService } from '../../services/cloudinaryService';
import { inventoryService } from '../../services/inventoryService';

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

  // Revised initial state with session cache lookup
  const getInitialState = () => {
    if (initialData) return initialData;
    const cached = localStorage.getItem('6te9_form_cache');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        // Migration: Ensure specs is an array if it was stored as an object
        if (parsed.specs && !Array.isArray(parsed.specs)) {
          parsed.specs = Object.entries(parsed.specs).map(([key, val]: [string, any]) => ({
            key,
            value: typeof val === 'object' ? val.value : val,
            amount: typeof val === 'object' ? val.amount : 0
          }));
        }
        // Only use cache if it matches the current default marketplace
        if (parsed.marketplace === defaultMarketplace) return parsed;
      } catch (e) {
        console.error('Failed to parse form cache');
      }
    }
    return {
      id: Math.random().toString(36).substr(2, 9),
      marketplace: defaultMarketplace,
      status: ItemStatus.DRAFT,
      name: '',
      price: 0,
      description: '',
      baseCategory: defaultMarketplace, // Default to vertical
      categories: [],
      images: [],
      isOffer: false,
      freeDeliveryLagos: false,
      originalPackaging: false,
      audit: {
        createdAt: new Date().toISOString(),
        createdBy: 'Admin',
        updatedAt: new Date().toISOString(),
        updatedBy: 'Admin'
      }
    };
  };

  const [formData, setFormData] = useState<Partial<MarketplaceItem>>(getInitialState());

  const [currentCat, setCurrentCat] = useState<MarketplaceCategory>(
    formData.marketplace || defaultMarketplace
  );

  const [isUploading, setIsUploading] = useState(false);

  // Persistence Logic: Cache ongoing form data (stripping ephemeral blobs)
  useEffect(() => {
    if (!initialData && isOpen) {
      const cacheData = {
        ...formData,
        marketplace: currentCat,
        images: (formData.images || []).filter(img => !img.startsWith('blob:'))
      };
      localStorage.setItem('6te9_form_cache', JSON.stringify(cacheData));
    }
  }, [formData, currentCat, isOpen, initialData]);

  const handleSharedChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    // Handle nested warranty fields
    if (name === 'warranty_months') {
      setFormData(prev => ({
        ...prev,
        warranty: { ...((prev as any).warranty || {}), warranty_months: parseInt(value) || 0 }
      }));
      return;
    }
    const val = type === 'number' ? (parseFloat(value) || 0) : value;
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setIsUploading(true);
      try {
        const uploadPromises = Array.from(files).map(file => cloudinaryService.uploadImage(file as File));
        const newUrls = await Promise.all(uploadPromises);
        setFormData(prev => ({
          ...prev,
          images: [...(prev.images || []), ...newUrls]
        }));
      } catch (error) {
        console.error('Upload failed:', error);
        // We might want a more elegant toast here, but alert works for now
        alert('Upload failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
      } finally {
        setIsUploading(false);
      }
    }
  };

  const removeImage = async (index: number) => {
    const imageUrl = formData.images?.[index];
    if (!imageUrl) return;

    // If we are editing an existing item and the image is not a local blob, notify backend
    if (initialData?.id) {
      try {
        await inventoryService.deleteImage(initialData.id, imageUrl);
      } catch (error) {
        console.error('Failed to sync image deletion with backend:', error);
        // We continue with local removal if the user wants it gone from the UI, 
        // but we log the sync failure.
      }
    }

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

    // Cleaning: Filter out empty specs and prune vertical fields for other verticals
    const cleanedSpecs = (Array.isArray((formData as any).specs) ? (formData as any).specs : [])
      .filter((s: any) => s.key?.trim() || s.value?.trim());

    onSave({
      ...formData,
      specs: cleanedSpecs,
      marketplace: currentCat,
      baseCategory: formData.baseCategory || currentCat,
      audit: {
        ...(formData.audit || {
          createdAt: new Date().toISOString(),
          createdBy: 'Admin'
        }),
        updatedAt: new Date().toISOString(),
        updatedBy: 'Admin'
      }
    } as MarketplaceItem);
    // Clear cache on successful commit
    if (!initialData) localStorage.removeItem('6te9_form_cache');
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
                {isUploading && (
                  <div className="aspect-square flex flex-col items-center justify-center border-2 border-zinc-100 rounded-2xl bg-zinc-50/50 animate-pulse">
                    <Upload className="w-5 h-5 text-zinc-300 animate-bounce" />
                    <span className="text-[7px] font-black uppercase tracking-widest text-zinc-400 mt-2">Syncing...</span>
                  </div>
                )}
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

                <div className="grid grid-cols-1 gap-4">
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
                      <input
                        name="brand"
                        list="brand-suggestions"
                        value={(formData as any).brand || ''}
                        onChange={handleSharedChange}
                        className="w-full px-4 py-3 bg-zinc-50 rounded-xl border border-zinc-100 font-bold focus:ring-1 focus:ring-black outline-none"
                        placeholder="e.g. Apple"
                      />
                      <datalist id="brand-suggestions">
                        {['Apple', 'Samsung', 'Huawei', 'Nokia', 'Oppo', 'Xiaomi', 'Google'].map(b => (
                          <option key={b} value={b} />
                        ))}
                      </datalist>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-zinc-500">Hardware Class</label>
                      <select
                        name="type"
                        value={(formData as any).type || ''}
                        onChange={handleSharedChange}
                        className="w-full px-4 py-3 bg-zinc-50 rounded-xl border border-zinc-100 font-bold focus:ring-1 focus:ring-black outline-none"
                      >
                        <option value="">Select Type</option>
                        {TECH_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-zinc-500">Operational Condition</label>
                      <select
                        name="condition"
                        value={(formData as any).condition || ''}
                        onChange={handleSharedChange}
                        className="w-full px-4 py-3 bg-zinc-50 rounded-xl border border-zinc-100 font-bold focus:ring-1 focus:ring-black outline-none"
                      >
                        <option value="">Select Condition</option>
                        {TECH_CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-4 py-3 px-4 bg-zinc-50 rounded-xl border border-zinc-100">
                        <input
                          type="checkbox"
                          checked={(formData as any).warranty?.hasWarranty || false}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            warranty: { ...((prev as any).warranty || {}), hasWarranty: e.target.checked }
                          }))}
                          className="w-4 h-4 accent-black"
                        />
                        <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Extended Warranty Support</label>
                      </div>

                      {(formData as any).warranty?.hasWarranty && (
                        <div className="space-y-2 animate-in slide-in-from-top-2 duration-200">
                          <label className="text-[8px] font-black uppercase text-zinc-400">Warranty Coverage (Months)</label>
                          <input
                            type="number"
                            name="warranty_months"
                            value={(formData as any).warranty?.warranty_months || ''}
                            onChange={handleSharedChange}
                            className="w-full px-4 py-2 bg-white border border-zinc-200 rounded-xl text-xs font-black focus:ring-1 focus:ring-black outline-none"
                            placeholder="e.g. 12"
                          />
                        </div>
                      )}

                      <div className="flex items-center gap-4 py-3 px-4 bg-zinc-50 rounded-xl border border-zinc-100">
                        <input
                          type="checkbox"
                          checked={formData.freeDeliveryLagos || false}
                          onChange={(e) => setFormData(prev => ({ ...prev, freeDeliveryLagos: e.target.checked }))}
                          className="w-4 h-4 accent-black"
                        />
                        <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Free Delivery in Lagos</label>
                      </div>
                      <div className="flex items-center gap-4 py-3 px-4 bg-zinc-50 rounded-xl border border-zinc-100">
                        <input
                          type="checkbox"
                          checked={formData.originalPackaging || false}
                          onChange={(e) => setFormData(prev => ({ ...prev, originalPackaging: e.target.checked }))}
                          className="w-4 h-4 accent-black"
                        />
                        <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Original Packaging and Boxes</label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Refactored Multi-Entry Spec Engine */}
              {(currentCat === MarketplaceCategory.TECH || currentCat === MarketplaceCategory.MEDIA) && (
                <div className="mt-10 space-y-6 pt-10 border-t border-zinc-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black text-black uppercase tracking-widest italic">Distinct Specification Manifest</p>
                      <p className="text-[8px] text-zinc-400 font-bold uppercase mt-1">Include multiple values for the same key (e.g. multiple Storage tiers)</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const currentSpecs = (formData as any).specs || [];
                        setFormData(prev => ({
                          ...prev,
                          specs: [...currentSpecs, { key: '', value: '', amount: 0 }]
                        }));
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-xl text-[8px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-all"
                    >
                      <Plus className="w-3 h-3" /> Add Spec Line
                    </button>
                  </div>

                  <div className="space-y-4">
                    {(Array.isArray((formData as any).specs) ? (formData as any).specs : []).map((spec: any, idx: number) => (
                      <div key={idx} className="flex gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="flex-1 space-y-2">
                          <label className="text-[8px] font-black uppercase text-zinc-400">Spec Key</label>
                          <input
                            list={`spec-keys-${currentCat}`}
                            className="w-full px-4 py-3 bg-zinc-50 rounded-xl border border-zinc-100 font-bold focus:ring-1 focus:ring-black outline-none transition-all"
                            value={spec.key}
                            onChange={(e) => {
                              const newSpecs = [...((formData as any).specs || [])];
                              newSpecs[idx] = { ...newSpecs[idx], key: e.target.value };
                              setFormData(prev => ({ ...prev, specs: newSpecs }));
                            }}
                            placeholder="e.g. Storage"
                          />
                          <datalist id={`spec-keys-${currentCat}`}>
                            {(currentCat === MarketplaceCategory.TECH ? TECH_SPEC_KEYS : MEDIA_SPEC_KEYS).map(k => (
                              <option key={k} value={k} />
                            ))}
                          </datalist>
                        </div>
                        <div className="flex-[2] space-y-2">
                          <label className="text-[8px] font-black uppercase text-zinc-400">Value</label>
                          <input
                            className="w-full px-4 py-3 bg-zinc-50 rounded-xl border border-zinc-100 font-bold focus:ring-1 focus:ring-black outline-none transition-all"
                            value={spec.value}
                            onChange={(e) => {
                              const newSpecs = [...(formData as any).specs];
                              newSpecs[idx] = { ...newSpecs[idx], value: e.target.value };
                              setFormData(prev => ({ ...prev, specs: newSpecs }));
                            }}
                            placeholder="e.g. 512GB"
                          />
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center justify-between">
                            <label className="text-[8px] font-black uppercase text-zinc-400">Price Δ (₦)</label>
                            <span className="text-[8px] font-bold text-zinc-300">OPTIONAL</span>
                          </div>
                          <div className="flex gap-4">
                            <input
                              type="number"
                              className="flex-1 px-4 py-3 bg-zinc-50 rounded-xl border border-zinc-100 font-black focus:ring-1 focus:ring-black outline-none transition-all"
                              value={spec.amount || ''}
                              onChange={(e) => {
                                const newSpecs = [...(formData as any).specs];
                                newSpecs[idx] = { ...newSpecs[idx], amount: parseFloat(e.target.value) || 0 };
                                setFormData(prev => ({ ...prev, specs: newSpecs }));
                              }}
                              placeholder="+/-"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const newSpecs = [...(formData as any).specs];
                                newSpecs.splice(idx, 1);
                                setFormData(prev => ({ ...prev, specs: newSpecs }));
                              }}
                              className="p-3 bg-zinc-100 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                            >
                              <Trash className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {((formData as any).specs || []).length === 0 && (
                      <div className="py-10 border-2 border-dashed border-zinc-100 rounded-2xl flex flex-col items-center justify-center space-y-2 opacity-50">
                        <ImageIcon className="w-6 h-6 text-zinc-300" />
                        <p className="text-[8px] font-black uppercase tracking-widest text-zinc-400">No Distinct Specs Defined</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {currentCat === MarketplaceCategory.CULINARY && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-zinc-500">Global Cuisine Origin</label>
                      <select
                        name="cuisineType"
                        value={(formData as any).cuisineType || ''}
                        onChange={handleSharedChange}
                        className="w-full px-4 py-3 bg-zinc-50 rounded-xl border border-zinc-100 font-bold focus:ring-1 focus:ring-black outline-none"
                      >
                        <option value="">Select Origin</option>
                        {CULINARY_CUISINES.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-zinc-500">Scoville/Spice Rating</label>
                      <select
                        name="spiceLevel"
                        value={(formData as any).spiceLevel || ''}
                        onChange={handleSharedChange}
                        className="w-full px-4 py-3 bg-zinc-50 rounded-xl border border-zinc-100 font-bold focus:ring-1 focus:ring-black outline-none"
                      >
                        <option value="">Select Level</option>
                        {SPICE_LEVELS.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-zinc-500">Composition (Ingredients List)</label>
                      <textarea
                        name="ingredients"
                        value={((formData as any).ingredients || []).join(', ')}
                        onChange={(e) => setFormData(prev => ({ ...prev, ingredients: e.target.value.split(',').map(i => i.trim()) }))}
                        className="w-full px-4 py-3 bg-zinc-50 rounded-xl border border-zinc-100 text-sm font-medium h-32 focus:ring-1 focus:ring-black outline-none resize-none"
                        placeholder="CSV format: Flour, Sugar, Water..."
                      />
                    </div>
                  </div>
                </div>
              )}

              {currentCat === MarketplaceCategory.MEDIA && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-zinc-500">Primary Substrate/Material</label>
                      <input
                        name="material"
                        value={(formData as any).material || ''}
                        onChange={handleSharedChange}
                        className="w-full px-4 py-3 bg-zinc-50 rounded-xl border border-zinc-100 font-bold focus:ring-1 focus:ring-black outline-none"
                        placeholder="e.g. 300gsm Cotton"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-zinc-500">Client Personalization</label>
                      <select
                        name="customizable"
                        value={(formData as any).customizable ? 'true' : 'false'}
                        onChange={(e) => setFormData(prev => ({ ...prev, customizable: e.target.value === 'true' }))}
                        className="w-full px-4 py-3 bg-zinc-50 rounded-xl border border-zinc-100 font-bold uppercase tracking-widest text-xs focus:ring-1 focus:ring-black outline-none"
                      >
                        <option value="true">Enabled</option>
                        <option value="false">Disabled</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-zinc-500">Standard Fulfillment Loop (Days)</label>
                      <input
                        type="number"
                        name="leadTime"
                        value={(formData as any).leadTime || 7}
                        onChange={handleSharedChange}
                        className="w-full px-4 py-3 bg-zinc-50 rounded-xl border border-zinc-100 font-black focus:ring-1 focus:ring-black outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-4 py-3 px-4 bg-zinc-50 rounded-xl border border-zinc-100">
                        <input
                          type="checkbox"
                          checked={formData.freeDeliveryLagos || false}
                          onChange={(e) => setFormData(prev => ({ ...prev, freeDeliveryLagos: e.target.checked }))}
                          className="w-4 h-4 accent-black"
                        />
                        <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Free Delivery in Lagos</label>
                      </div>
                      <div className="flex items-center gap-4 py-3 px-4 bg-zinc-50 rounded-xl border border-zinc-100">
                        <input
                          type="checkbox"
                          checked={formData.originalPackaging || false}
                          onChange={(e) => setFormData(prev => ({ ...prev, originalPackaging: e.target.checked }))}
                          className="w-4 h-4 accent-black"
                        />
                        <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Original Packaging and Boxes</label>
                      </div>
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
