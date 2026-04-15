import React from 'react';
import {
  LayoutDashboard,
  Package,
  TrendingUp,
  Monitor,
  Printer,
  UtensilsCrossed,
  Settings,
  LogOut,
  MessageSquare,
  Users,
  Newspaper,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  ShoppingCart
} from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { MarketplaceCategory, ViewType, User } from '../types';
import { useState } from 'react';

interface SidebarProps {
  onLogout: () => void;
  user: User | null;
}

const Sidebar: React.FC<SidebarProps> = ({
  onLogout,
  user
}) => {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { id: 'DASHBOARD', icon: <LayoutDashboard className="w-5 h-5" />, label: 'Overview' },
    { id: 'ORDERS', icon: <ShoppingCart className="w-5 h-5" />, label: 'Orders' },
    { id: 'INVENTORY', icon: <Package className="w-5 h-5" />, label: 'Inventory' },
    { id: 'ANALYTICS', icon: <TrendingUp className="w-5 h-5" />, label: 'Analytics' },
  ];

  const marketplaceItems = [
    { id: MarketplaceCategory.TECH, icon: <Monitor className="w-5 h-5" />, label: 'Tech', path: '/inventory/tech' },
    { id: MarketplaceCategory.MEDIA, icon: <Printer className="w-5 h-5" />, label: 'Media', path: '/inventory/media' },
    { id: MarketplaceCategory.CULINARY, icon: <UtensilsCrossed className="w-5 h-5" />, label: 'Culinary', path: '/inventory/culinary' },
  ];

  const integrationItems = [
    { id: 'WHATSAPP', icon: <MessageSquare className="w-5 h-5" />, label: 'WhatsApp API', path: '/whatsapp' },
  ];

  const relationshipItems = [
    { id: 'LEADS', icon: <Users className="w-5 h-5" />, label: 'Lead Funnel', path: '/leads' },
  ];

  return (
    <aside className={`border-r border-zinc-200 flex flex-col h-full bg-white select-none transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
      <div className={`p-6 pb-4 flex items-center ${isCollapsed ? 'justify-center border-b border-zinc-100 flex-col mb-4' : 'justify-between'}`}>
        <div className={`flex flex-col ${isCollapsed ? 'items-center' : ''}`}>
          <img src="/logo.svg" alt="6TE9" className="w-8 h-8 object-contain mb-2" />
          {!isCollapsed && <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Admin Panel v1.0</p>}
        </div>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`p-1.5 hover:bg-zinc-100 rounded-lg text-zinc-400 hover:text-black transition-colors ${isCollapsed ? 'mt-2' : ''}`}
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      <nav className="flex-1 px-3 mt-4 space-y-8 overflow-y-auto no-scrollbar">
        <div>
          {!isCollapsed && <p className="px-4 text-[10px] font-black text-zinc-300 uppercase tracking-widest mb-4">Core Management</p>}
          <div className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.id}
                to={item.id === 'DASHBOARD' ? '/' : `/${item.id.toLowerCase()}`}
                title={isCollapsed ? item.label : undefined}
                className={({ isActive }) => `w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${isActive
                  ? 'bg-black text-white shadow-xl shadow-zinc-200'
                  : 'text-zinc-500 hover:bg-zinc-50 hover:text-black'
                  }`}
              >
                {item.icon}
                {!isCollapsed && item.label}
              </NavLink>
            ))}
          </div>
        </div>

        <div>
          {!isCollapsed && <p className="px-4 text-[10px] font-black text-zinc-300 uppercase tracking-widest mb-4">Verticals</p>}
          <div className="space-y-1">
            {marketplaceItems.map((item) => (
              <NavLink
                key={item.id}
                to={item.path}
                title={isCollapsed ? item.label : undefined}
                className={({ isActive }) => `w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${isActive
                  ? 'bg-black text-white shadow-xl shadow-zinc-200'
                  : 'text-zinc-500 hover:bg-zinc-50 hover:text-black'
                  }`}
              >
                {item.icon}
                {!isCollapsed && item.label}
              </NavLink>
            ))}
            <NavLink
              to="/news"
              title={isCollapsed ? 'News & Offers' : undefined}
              className={({ isActive }) => `w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${isActive
                ? 'bg-black text-white shadow-xl shadow-zinc-200'
                : 'text-zinc-500 hover:bg-zinc-50 hover:text-black'
                }`}
            >
              <Newspaper className="w-5 h-5" />
              {!isCollapsed && 'News & Offers'}
            </NavLink>
          </div>
        </div>

        <div>
          {!isCollapsed && <p className="px-4 text-[10px] font-black text-zinc-300 uppercase tracking-widest mb-4">Integrations</p>}
          <div className="space-y-1">
            {integrationItems.map((item) => (
              <NavLink
                key={item.id}
                to={item.path}
                title={isCollapsed ? item.label : undefined}
                className={({ isActive }) => `w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${isActive
                  ? 'bg-black text-white shadow-xl shadow-zinc-200'
                  : 'text-zinc-500 hover:bg-zinc-50 hover:text-black'
                  }`}
              >
                {item.icon}
                {!isCollapsed && item.label}
              </NavLink>
            ))}
          </div>
        </div>

        <div>
          {!isCollapsed && <p className="px-4 text-[10px] font-black text-zinc-300 uppercase tracking-widest mb-4">Relationship Mgt</p>}
          <div className="space-y-1">
            {relationshipItems.map((item) => (
              <NavLink
                key={item.id}
                to={item.path}
                title={isCollapsed ? item.label : undefined}
                className={({ isActive }) => `w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${isActive
                  ? 'bg-black text-white shadow-xl shadow-zinc-200'
                  : 'text-zinc-500 hover:bg-zinc-50 hover:text-black'
                  }`}
              >
                {item.icon}
                {!isCollapsed && item.label}
              </NavLink>
            ))}
          </div>
        </div>

        {user?.role === 'SUPER_ADMIN' && (
          <div>
            {!isCollapsed && <p className="px-4 text-[10px] font-black text-zinc-300 uppercase tracking-widest mb-4">Administration</p>}
            <div className="space-y-1">
              <NavLink
                to="/users"
                title={isCollapsed ? "Identity Mgt" : undefined}
                className={({ isActive }) => `w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${isActive
                  ? 'bg-black text-white shadow-xl shadow-zinc-200'
                  : 'text-zinc-500 hover:bg-zinc-50 hover:text-black'
                  }`}
              >
                <ShieldCheck className="w-5 h-5" />
                {!isCollapsed && 'Identity Mgt'}
              </NavLink>
            </div>
          </div>
        )}
      </nav>

      <div className={`p-4 mt-auto border-t border-zinc-100 bg-zinc-50/30 ${isCollapsed ? 'flex flex-col gap-4 items-center' : ''}`}>
        <NavLink
          to="/settings"
          title={isCollapsed ? "System Settings" : undefined}
          className={({ isActive }) => `w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${isActive ? 'bg-black text-white' : 'text-zinc-500 hover:bg-zinc-50 hover:text-black'
            }`}
        >
          <Settings className="w-5 h-5" />
          {!isCollapsed && 'System Settings'}
        </NavLink>

        <div className={`px-4 py-3 bg-white border border-zinc-200 rounded-xl flex items-center gap-3 group ${isCollapsed ? 'p-2 flex-col justify-center' : 'mt-4'}`}>
          <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-black text-xs shrink-0">
            {user?.name.substring(0, 1) || 'A'}
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-black truncate text-black">{user?.name || 'Admin'}</p>
              <p className="text-[10px] text-zinc-400 truncate uppercase font-bold tracking-tighter">{user?.role || 'ADMIN'}</p>
            </div>
          )}
          <button
            onClick={onLogout}
            className={`p-1.5 text-zinc-300 hover:text-black hover:bg-zinc-100 rounded-md transition-all ${isCollapsed ? 'mt-1' : ''}`}
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
