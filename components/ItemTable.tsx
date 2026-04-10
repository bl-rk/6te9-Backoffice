import React from 'react';
import { Edit, Trash } from 'lucide-react';
import { MarketplaceItem, ItemStatus } from '../types';

interface ItemTableProps {
  items: MarketplaceItem[];
  onEdit: (item: MarketplaceItem) => void;
  onDelete: (id: string) => void;
}

const ItemTable: React.FC<ItemTableProps> = ({ items, onEdit, onDelete }) => {
  return (
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="border-b border-zinc-100 bg-zinc-50/50">
          <th className="px-6 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Item Details</th>
          <th className="px-6 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Pricing</th>
          <th className="px-6 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Base Category</th>
          <th className="px-6 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Tags</th>
          <th className="px-6 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Status</th>
          <th className="px-6 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Last Updated</th>
          <th className="px-6 py-4"></th>
        </tr>
      </thead>
      <tbody className="divide-y divide-zinc-100">
        {items.length === 0 ? (
          <tr>
            <td colSpan={7} className="px-6 py-12 text-center text-zinc-400 text-sm font-medium">
              No catalog entries found.
            </td>
          </tr>
        ) : (
          items.map((item) => (
            <tr key={item.id} className="group hover:bg-zinc-50/30 transition-colors">
              <td className="px-6 py-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-zinc-100 rounded-lg flex items-center justify-center text-xs font-mono border border-zinc-200 group-hover:bg-white transition-colors overflow-hidden">
                    {item.images && item.images.length > 0 ? (
                      <img src={item.images[0]} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="font-black text-zinc-300">{item.name.substring(0, 2).toUpperCase()}</span>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-black text-black">{item.name}</p>
                      {item.isOffer && (
                        <span className="px-1.5 py-0.5 bg-black text-white rounded text-[8px] font-black uppercase tracking-widest">OFFER</span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-400 font-mono mt-0.5 whitespace-nowrap overflow-hidden text-ellipsis max-w-[120px]">
                      {item.sku}
                      <span className="mx-2 opacity-50">|</span>
                      <span className="text-[10px] font-black uppercase text-black/40">
                        {item.marketplace === 'TECH' && `${(item as any).brand || 'Standard'} ${(item as any).condition || ''}`}
                        {item.marketplace === 'MEDIA' && `${(item as any).material || 'Generic'}`}
                        {item.marketplace === 'CULINARY' && `${(item as any).cuisineType || 'Global'}`}
                      </span>
                    </p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-col">
                  <span className={`text-sm font-black ${item.salePrice ? 'text-zinc-300 line-through text-xs' : 'text-black'}`}>
                    ₦{item.price.toLocaleString()}
                  </span>
                  {item.salePrice && (
                    <span className="text-sm font-black text-black">
                      ₦{item.salePrice.toLocaleString()}
                    </span>
                  )}
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 bg-zinc-100 rounded-lg text-black">
                  {item.baseCategory || 'UNCATEGORIZED'}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-wrap gap-1">
                  {item.categories.map(cat => (
                    <span key={cat} className="text-[9px] font-black px-2 py-0.5 bg-white rounded border border-zinc-200 text-zinc-400 uppercase tracking-tighter">
                      {cat}
                    </span>
                  ))}
                </div>
              </td>
              <td className="px-6 py-4">
                <span className={`inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${item.status === ItemStatus.PUBLISHED
                  ? 'bg-zinc-50 border-zinc-200 text-black'
                  : 'bg-white border-dashed border-zinc-200 text-zinc-400'
                  }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${item.status === ItemStatus.PUBLISHED ? 'bg-black' : 'bg-zinc-300'}`}></span>
                  {item.status}
                </span>
              </td>
              <td className="px-6 py-4">
                <p className="text-xs font-bold text-zinc-500">
                  {item.audit.updatedAt ? new Date(item.audit.updatedAt).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' }) : 'Never'}
                </p>
                <p className="text-[9px] text-zinc-400 uppercase font-black mt-0.5 tracking-wider">
                  BY {item.audit.updatedBy === 'fd32f325-3705-46a5-b7bc-cf8da12e7953' ? 'Sixte9 Admin' : (item.audit.updatedBy || 'Unknown')}
                </p>
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => onEdit(item)} className="p-2 hover:bg-black hover:text-white rounded-lg transition-all" title="Edit">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => onDelete(item.id)} className="p-2 hover:bg-black hover:text-white rounded-lg transition-all" title="Delete">
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
};

export default ItemTable;
