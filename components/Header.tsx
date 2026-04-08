
import React from 'react';
import { Plus, Bell } from 'lucide-react';
import { MarketplaceCategory, ViewType } from '../types';

interface HeaderProps {
  activeView: ViewType;
  activeMarketplace: MarketplaceCategory;
  onCreateClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ activeView, activeMarketplace, onCreateClick }) => {
  const getTitle = () => {
    if (activeView === 'DASHBOARD') return 'Dashboard Overview';
    if (activeView === 'ANALYTICS') return 'Back-Office Analytics';
    
    switch (activeMarketplace) {
      case MarketplaceCategory.TECH: return 'Tech Marketplace';
      case MarketplaceCategory.MEDIA: return 'Media Marketplace';
      case MarketplaceCategory.CULINARY: return 'Culinary Marketplace';
      default: return 'Inventory';
    }
  };

  return (
    <header className="h-20 border-b border-zinc-200 bg-white flex items-center justify-between px-8 sticky top-0 z-10">
      <div>
        <h2 className="text-xl font-bold text-black tracking-tight">{getTitle()}</h2>
        <p className="text-xs text-zinc-400 mt-0.5">Managing items and catalog data</p>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 text-zinc-400 hover:text-black transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-black rounded-full border-2 border-white"></span>
        </button>
        <div className="h-6 w-px bg-zinc-200 mx-2"></div>
        <button 
          onClick={onCreateClick}
          className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-zinc-800 transition-all shadow-sm active:scale-95"
        >
          <Plus className="w-4 h-4" />
          New Item
        </button>
      </div>
    </header>
  );
};

export default Header;
