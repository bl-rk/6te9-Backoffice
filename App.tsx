
import React, { useState, useMemo, useEffect } from 'react';
import {
  MarketplaceCategory,
  MarketplaceItem,
  ViewType,
  ItemStatus,
  User,
  UserStatus
} from './types';
import { initialMockItems } from './utils/mockData';
import StatsCard from './components/StatsCard';
import ItemTable from './components/ItemTable';
import ItemForm from './components/modals/ItemForm';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Auth from './components/Auth';
import Settings from './components/Settings';
import Analytics from './components/Analytics';
import BulkUploadModal from './components/modals/BulkUploadModal';
import NewsManagement from './components/NewsManagement';
import LeadManagement from './components/LeadManagement';
import UserManagement from './components/UserManagement';
import WhatsAppIntegration from './components/WhatsAppIntegration';
import OrdersManagement from './components/OrdersManagement';
import GenericConfirmModal from './components/modals/GenericConfirmModal';
import { authService } from './services/authService';
import { inventoryService } from './services/inventoryService';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Package, Tag, TrendingUp, Clock, Search, Download, AlertTriangle, FileUp, ShoppingCart } from 'lucide-react';

const App: React.FC = () => {
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MarketplaceItem | null>(null);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const role = localStorage.getItem('user_role');
    if (token) {
      setIsAuthenticated(true);
      setUser({
        id: 'system',
        email: 'systadmin@6te9.com',
        name: 'System Admin',
        role: (role || 'ADMIN').toUpperCase().replace('_', '_') as any,
        status: UserStatus.ACTIVE,
        dateAdded: new Date().toISOString()
      });
    }
  }, []);

  // Helper to get active marketplace and view from path
  const activeView = useMemo(() => {
    const path = location.pathname;
    if (path === '/') return 'DASHBOARD' as ViewType;
    if (path.startsWith('/inventory')) return 'INVENTORY' as ViewType;
    if (path === '/analytics') return 'ANALYTICS' as ViewType;
    if (path === '/settings') return 'SETTINGS' as ViewType;
    if (path === '/leads') return 'LEADS' as ViewType;
    if (path === '/whatsapp') return 'WHATSAPP' as ViewType;
    if (path === '/news') return 'NEWS' as ViewType;
    return 'DASHBOARD' as ViewType;
  }, [location.pathname]);

  const activeMarketplace = useMemo(() => {
    const path = location.pathname;
    if (path === '/inventory/media') return MarketplaceCategory.MEDIA;
    if (path === '/inventory/culinary') return MarketplaceCategory.CULINARY;
    return MarketplaceCategory.TECH;
  }, [location.pathname]);

  useEffect(() => {
    if (isAuthenticated && (activeView === 'INVENTORY' || activeView === 'DASHBOARD')) {
      fetchInventory();
    }
  }, [isAuthenticated, activeView, activeMarketplace]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const isGeneralInventory = activeView === 'INVENTORY' && location.pathname === '/inventory';
      const data = (activeView === 'DASHBOARD' || isGeneralInventory)
        ? await inventoryService.getAllItems()
        : await inventoryService.getItems(activeMarketplace);
      setItems(data);
    } catch (err) {
      console.error('Inventory sync failed:', err);
    } finally {
      setLoading(false);
    }
  };

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ItemStatus | 'ALL'>('ALL');

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchQuery.toLowerCase());

      const isGeneralInventory = activeView === 'INVENTORY' && location.pathname === '/inventory';
      const matchesMarketplace = (activeView === 'DASHBOARD' || isGeneralInventory) ? true : item.marketplace === activeMarketplace;
      const matchesStatus = statusFilter === 'ALL' ? true : item.status === statusFilter;

      return matchesSearch && matchesMarketplace && matchesStatus;
    });
  }, [items, searchQuery, activeMarketplace, activeView, statusFilter]);

  const handleLogin = (loggedUser: User) => {
    setUser(loggedUser);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setUser(null);
  };

  const handleCreateItem = () => {
    setEditingItem(null);
    setIsFormOpen(true);
  };

  const handleEditItem = (item: MarketplaceItem) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleDeleteItem = (id: string) => {
    setConfirmDeleteId(id);
  };

  const handleConfirmDeleteItem = async () => {
    if (confirmDeleteId) {
      try {
        await inventoryService.deleteItem(confirmDeleteId, activeMarketplace);
        setItems(prev => prev.filter(i => i.id !== confirmDeleteId));
        setConfirmDeleteId(null);
      } catch (err) {
        alert('Failed to abolish record.');
      }
    }
  };

  const handleSaveItem = async (item: MarketplaceItem) => {
    try {
      const saved = await inventoryService.saveItem(item, item.marketplace);
      if (editingItem) {
        setItems(prev => prev.map(i => i.id === saved.id ? saved : i));
      } else {
        setItems(prev => [saved, ...prev]);
      }
      setIsFormOpen(false);
    } catch (err) {
      alert('Failed to synchronize record.');
    }
  };

  const handleBulkUploadComplete = (count: number) => {
    console.log(`${count} items added via bulk upload.`);
    // In real app, re-fetch items
  };

  if (!isAuthenticated) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-zinc-900/50 backdrop-blur-sm transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Wrapper */}
      <div className={`fixed lg:static inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <Sidebar
          onLogout={handleLogout}
          user={user}
        />
      </div>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {maintenanceMode && (
          <div className="h-10 bg-black text-white flex items-center justify-center gap-3 px-8 animate-pulse">
            <AlertTriangle className="w-4 h-4 text-white" />
            <p className="text-[10px] font-black uppercase tracking-[0.2em]">Maintenance Mode Active: Platform restricted to administrative operations only</p>
          </div>
        )}

        <Header
          activeView={activeView}
          activeMarketplace={activeMarketplace}
          onCreateClick={handleCreateItem}
          onMobileMenuClick={() => setMobileMenuOpen(true)}
        />

        <main className="flex-1 overflow-y-auto p-8 no-scrollbar">
          <Routes>
            <Route path="/" element={
              <div className="space-y-8 animate-in fade-in duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatsCard title="Total Items" value={items.length} icon={<Package className="w-5 h-5" />} trend="+12% from last month" />
                  <StatsCard title="Active Offers" value={items.filter(i => i.isOffer).length} icon={<Tag className="w-5 h-5" />} trend="High activity" />
                  <StatsCard title="Total Value" value={`₦${items.reduce((acc, curr) => acc + curr.price, 0).toLocaleString()}`} icon={<TrendingUp className="w-5 h-5" />} trend="+5.4% YoY" />
                  <StatsCard title="Pending Review" value={items.filter(i => i.status === ItemStatus.DRAFT).length} icon={<Clock className="w-5 h-5" />} />
                </div>

                <div className="bg-black text-white p-8 rounded-2xl">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold uppercase tracking-tight italic">Recent Inventory Logs</h2>
                  </div>
                  <div className="space-y-4">
                    {items.slice(0, 5).map(item => (
                      <div key={item.id} className="flex items-center justify-between py-3 border-b border-white/10 last:border-0">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-white/5 rounded flex items-center justify-center text-xs font-mono">
                            {item.marketplace.substring(0, 1)}
                          </div>
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-xs text-white/50">{item.sku}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">₦{item.price.toLocaleString()}</p>
                          <p className="text-xs text-white/50 uppercase font-black tracking-widest">{item.status}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            } />

            <Route path="/inventory/*" element={
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                  <div className="relative w-full max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <input
                      type="text"
                      placeholder="Search catalog by name or SKU..."
                      className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black transition-all"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setIsBulkUploadOpen(true)}
                      className="flex items-center gap-2 px-4 py-2.5 border border-zinc-200 rounded-lg text-sm font-bold hover:bg-zinc-50 transition-colors"
                    >
                      <FileUp className="w-4 h-4" />
                      Bulk Actions
                    </button>
                    <select
                      className="bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2.5 text-sm font-bold focus:outline-none"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as any)}
                    >
                      <option value="ALL">All Status</option>
                      <option value={ItemStatus.PUBLISHED}>Published</option>
                      <option value={ItemStatus.DRAFT}>Draft</option>
                    </select>
                  </div>
                </div>

                <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
                  <ItemTable
                    items={filteredItems}
                    onEdit={handleEditItem}
                    onDelete={handleDeleteItem}
                  />
                </div>
              </div>
            } />

            <Route path="/analytics" element={<Analytics />} />
            <Route path="/leads" element={<LeadManagement />} />
            <Route path="/whatsapp" element={<WhatsAppIntegration />} />
            <Route path="/orders" element={<OrdersManagement />} />
            <Route path="/news" element={<NewsManagement />} />
            <Route path="/users" element={<UserManagement />} />

            <Route path="/settings" element={
              <Settings
                maintenanceMode={maintenanceMode}
                setMaintenanceMode={setMaintenanceMode}
                onOpenBulkUpload={() => setIsBulkUploadOpen(true)}
              />
            } />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>

      {isFormOpen && (
        <ItemForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSave={handleSaveItem}
          initialData={editingItem}
          defaultMarketplace={activeMarketplace}
        />
      )}

      <BulkUploadModal
        isOpen={isBulkUploadOpen}
        onClose={() => setIsBulkUploadOpen(false)}
        onUploadComplete={handleBulkUploadComplete}
      />

      <GenericConfirmModal
        isOpen={!!confirmDeleteId}
        onClose={() => setConfirmDeleteId(null)}
        onConfirm={handleConfirmDeleteItem}
        title="Delete Inventory Item"
        message="Are you sure you want to permanently remove this item from the catalog? This will affect all associated records."
        confirmLabel="Delete Item"
      />
    </div>
  );
};

export default App;
