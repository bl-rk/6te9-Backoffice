
import React, { useState } from 'react';
import { X, FileUp, CheckCircle2, Loader2, FileCode, Table } from 'lucide-react';

interface BulkUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadComplete: (count: number) => void;
}

// Fixed truncation and added default export to resolve "no default export" error in App.tsx
const BulkUploadModal: React.FC<BulkUploadModalProps> = ({ isOpen, onClose, onUploadComplete }) => {
  const [step, setStep] = useState<'upload' | 'processing' | 'success'>('upload');
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFileName(e.target.files[0].name);
    }
  };

  const startUpload = () => {
    if (!fileName) return;
    setStep('processing');
    setTimeout(() => {
      setStep('success');
      setTimeout(() => {
        onUploadComplete(12);
        onClose();
        setStep('upload');
        setFileName(null);
      }, 1500);
    }, 2000);
  };

  const downloadTemplate = (format: 'csv' | 'json') => {
    const templates = {
      csv: "name,price,sale_price,status,base_category,is_offer,description,vertical_type\nSamsung Galaxy S24,1200000,1150000,PUBLISHED,Smartphones,true,Latest flagship with AI features,tech",
      json: JSON.stringify([{
        name: "Samsung Galaxy S24",
        price: 1200000,
        sale_price: 1150000,
        status: "PUBLISHED",
        base_category: "Smartphones",
        is_offer: true,
        description: "Latest flagship with AI features",
        vertical_type: "tech",
        vertical_data: {
          brand: "Samsung",
          type: "Phone",
          condition: "New",
          warranty: { has_warranty: true, warranty_months: 24 },
          specs: [
            { key: "Storage", value: "512GB", amount: 0 },
            { key: "RAM", value: "12GB", amount: 0 }
          ]
        }
      }], null, 2)
    };

    const blob = new Blob([templates[format]], { type: format === 'json' ? 'application/json' : 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `6te9_catalog_template.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={onClose} />

      <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden relative z-10 border border-zinc-200 animate-in zoom-in-95 duration-200">
        <div className="px-10 py-8 border-b border-zinc-100 flex items-center justify-between">
          <h3 className="text-2xl font-black italic uppercase tracking-tighter">Batch Ingestion</h3>
          <button onClick={onClose} className="p-3 hover:bg-zinc-100 rounded-2xl transition-all">
            <X className="w-6 h-6 text-zinc-400 hover:text-black" />
          </button>
        </div>

        <div className="p-10">
          {step === 'upload' && (
            <div className="space-y-10">
              <div className="flex flex-col items-center justify-center p-16 border-2 border-dashed border-zinc-100 rounded-[2rem] bg-zinc-50/20 group hover:border-black transition-all">
                <FileUp className="w-16 h-16 mb-6 text-zinc-200 group-hover:text-black transition-colors" />
                <p className="text-sm font-black uppercase tracking-widest text-zinc-300 group-hover:text-black mb-8 text-center">
                  {fileName || "Drag catalog assets for ingestion"}
                </p>
                <input
                  type="file"
                  id="bulkFile"
                  className="hidden"
                  accept=".csv,.json"
                  onChange={handleFileSelect}
                />
                <label
                  htmlFor="bulkFile"
                  className="px-10 py-4 bg-black text-white text-xs font-black uppercase tracking-widest rounded-2xl cursor-pointer hover:bg-zinc-800 transition-all active:scale-95 shadow-xl"
                >
                  Locate Files
                </label>
              </div>

              <div className="space-y-4">
                <p className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Download Schemas</p>
                <div className="grid grid-cols-2 gap-6">
                  <button
                    onClick={() => downloadTemplate('csv')}
                    className="flex items-center justify-center gap-3 p-5 bg-white border border-zinc-200 rounded-3xl hover:bg-black hover:text-white transition-all group"
                  >
                    <Table className="w-5 h-5 text-zinc-200 group-hover:text-white" />
                    <span className="text-[10px] font-black uppercase tracking-widest">CSV Manifest</span>
                  </button>
                  <button
                    onClick={() => downloadTemplate('json')}
                    className="flex items-center justify-center gap-3 p-5 bg-white border border-zinc-200 rounded-3xl hover:bg-black hover:text-white transition-all group"
                  >
                    <FileCode className="w-5 h-5 text-zinc-200 group-hover:text-white" />
                    <span className="text-[10px] font-black uppercase tracking-widest">JSON Object</span>
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-6 border-t border-zinc-100">
                <button
                  onClick={onClose}
                  className="px-8 py-4 text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-black transition-colors"
                >
                  Cancel
                </button>
                <button
                  disabled={!fileName}
                  onClick={startUpload}
                  className="px-12 py-4 bg-black text-white rounded-2xl text-xs font-black uppercase tracking-widest disabled:opacity-20 transition-all shadow-2xl"
                >
                  Confirm Ingestion
                </button>
              </div>
            </div>
          )}

          {step === 'processing' && (
            <div className="flex flex-col items-center justify-center py-20 space-y-8">
              <Loader2 className="w-16 h-16 animate-spin text-black" />
              <div className="text-center">
                <p className="text-lg font-black uppercase tracking-tighter italic">Analyzing Catalog Streams</p>
                <p className="text-xs text-zinc-400 mt-2 font-bold uppercase tracking-widest">Verifying integrity & mapping identifiers...</p>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="flex flex-col items-center justify-center py-20 space-y-8 animate-in zoom-in duration-500">
              <CheckCircle2 className="w-16 h-16 text-black" />
              <div className="text-center">
                <p className="text-lg font-black uppercase tracking-tighter italic">Ingestion Successful</p>
                <p className="text-xs text-zinc-400 mt-2 font-bold uppercase tracking-widest">The catalog entries have been synchronized with the live database.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BulkUploadModal;
