
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
  Newspaper
} from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { MarketplaceCategory, ViewType, User } from '../types';

interface SidebarProps {
  onLogout: () => void;
  user: User | null;
}

const Sidebar: React.FC<SidebarProps> = ({
  onLogout,
  user
}) => {
  const navigate = useNavigate();
  const navItems = [
    { id: 'DASHBOARD', icon: <LayoutDashboard className="w-5 h-5" />, label: 'Overview' },
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
    <aside className="w-64 border-r border-zinc-200 flex flex-col h-full bg-white select-none">
      <div className="p-8 pb-4">
        <h1 className="text-2xl font-black tracking-tighter uppercase italic">6te9</h1>
        <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-1">Admin Panel v1.0</p>
      </div>

      <nav className="flex-1 px-4 mt-8 space-y-8 overflow-y-auto no-scrollbar">
        <div>
          <p className="px-4 text-[10px] font-black text-zinc-300 uppercase tracking-widest mb-4">Core Management</p>
          <div className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.id}
                to={item.id === 'DASHBOARD' ? '/' : `/${item.id.toLowerCase()}`}
                className={({ isActive }) => `w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${isActive
                    ? 'bg-black text-white shadow-xl shadow-zinc-200'
                    : 'text-zinc-500 hover:bg-zinc-50 hover:text-black'
                  }`}
              >
                {item.icon}
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>

        <div>
          <p className="px-4 text-[10px] font-black text-zinc-300 uppercase tracking-widest mb-4">Verticals</p>
          <div className="space-y-1">
            {marketplaceItems.map((item) => (
              <NavLink
                key={item.id}
                to={item.path}
                className={({ isActive }) => `w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${isActive
                    ? 'bg-black text-white shadow-xl shadow-zinc-200'
                    : 'text-zinc-500 hover:bg-zinc-50 hover:text-black'
                  }`}
              >
                {item.icon}
                {item.label}
              </NavLink>
            ))}
            <NavLink
              to="/news"
              className={({ isActive }) => `w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${isActive
                  ? 'bg-black text-white shadow-xl shadow-zinc-200'
                  : 'text-zinc-500 hover:bg-zinc-50 hover:text-black'
                }`}
            >
              <Newspaper className="w-5 h-5" />
              News & Offers
            </NavLink>
          </div>
        </div>

        <div>
          <p className="px-4 text-[10px] font-black text-zinc-300 uppercase tracking-widest mb-4">Integrations</p>
          <div className="space-y-1">
            {integrationItems.map((item) => (
              <NavLink
                key={item.id}
                to={item.path}
                className={({ isActive }) => `w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${isActive
                    ? 'bg-black text-white shadow-xl shadow-zinc-200'
                    : 'text-zinc-500 hover:bg-zinc-50 hover:text-black'
                  }`}
              >
                {item.icon}
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>

        <div>
          <p className="px-4 text-[10px] font-black text-zinc-300 uppercase tracking-widest mb-4">Relationship Mgt</p>
          <div className="space-y-1">
            {relationshipItems.map((item) => (
              <NavLink
                key={item.id}
                to={item.path}
                className={({ isActive }) => `w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${isActive
                    ? 'bg-black text-white shadow-xl shadow-zinc-200'
                    : 'text-zinc-500 hover:bg-zinc-50 hover:text-black'
                  }`}
              >
                {item.icon}
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      </nav>

      <div className="p-4 mt-auto border-t border-zinc-100 bg-zinc-50/30">
        <NavLink
          to="/settings"
          className={({ isActive }) => `w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${isActive ? 'bg-black text-white' : 'text-zinc-500 hover:bg-zinc-50 hover:text-black'
            }`}
        >
          <Settings className="w-5 h-5" />
          System Settings
        </NavLink>

        <div className="mt-4 px-4 py-3 bg-white border border-zinc-200 rounded-xl flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-black text-xs">
            {user?.name.substring(0, 1) || 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-black truncate text-black">{user?.name || 'Admin'}</p>
            <p className="text-[10px] text-zinc-400 truncate uppercase font-bold tracking-tighter">{user?.role || 'ADMIN'}</p>
          </div>
          <button
            onClick={onLogout}
            className="p-1.5 text-zinc-300 hover:text-black hover:bg-zinc-100 rounded-md transition-all"
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
