
import React from 'react';
import { 
  LayoutDashboard, 
  PackageSearch, 
  Map as MapIcon, 
  ClipboardList, 
  TrendingUp, 
  Trash2, 
  Truck,
  Settings,
  PlusCircle,
  Crown,
  LogOut,
  CalendarDays,
  Lock
} from 'lucide-react';
import { WarehouseConfig } from '../types';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
  color?: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, active, onClick, color }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
      active 
        ? `${color || 'bg-blue-600'} text-white shadow-lg shadow-blue-200` 
        : 'text-slate-500 hover:bg-slate-100 hover:text-blue-600'
    }`}
  >
    {icon}
    <span className="font-medium text-sm">{label}</span>
  </button>
);

interface LayoutProps {
  children: React.ReactNode;
  activeView: string;
  setActiveView: (view: string) => void;
  config: WarehouseConfig;
  onInstall: () => void;
  showInstall: boolean;
  onLogout: () => void;
  isSuperAdmin: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, activeView, setActiveView, config, onInstall, showInstall, onLogout, isSuperAdmin }) => {
  
  const daysRemaining = config.expiryDate 
    ? Math.ceil((new Date(config.expiryDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24))
    : 0;

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden select-none">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col p-4 shadow-sm z-40">
        <div className="flex items-center space-x-2 px-2 mb-10">
          <div className="bg-blue-600 p-2 rounded-xl shadow-inner">
            <Truck className="text-white w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-800">ELENA</h1>
        </div>

        <nav className="flex-1 space-y-1">
          {isSuperAdmin && (
            <div className="mb-4">
               <div className="pt-2 pb-1 text-[10px] font-black text-blue-600 uppercase tracking-widest px-4">Administration</div>
               <SidebarItem 
                icon={<Crown size={18} />} 
                label="Console Justin" 
                active={activeView === 'superadmin'} 
                onClick={() => setActiveView('superadmin')}
                color="bg-slate-900"
              />
            </div>
          )}
          
          <div className="pt-2 pb-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4">Menu Entrepôt</div>
          
          <SidebarItem 
            icon={<LayoutDashboard size={18} />} 
            label="Tableau de bord" 
            active={activeView === 'dashboard'} 
            onClick={() => setActiveView('dashboard')}
          />
          <SidebarItem 
            icon={<PlusCircle size={18} />} 
            label="Catalogue" 
            active={activeView === 'catalog'} 
            onClick={() => setActiveView('catalog')}
          />
          <SidebarItem 
            icon={<PackageSearch size={18} />} 
            label="Stock" 
            active={activeView === 'inventory'} 
            onClick={() => setActiveView('inventory')}
          />
          <SidebarItem 
            icon={<MapIcon size={18} />} 
            label="Cartographie" 
            active={activeView === 'map'} 
            onClick={() => setActiveView('map')}
          />
          <SidebarItem 
            icon={<ClipboardList size={18} />} 
            label="Réception" 
            active={activeView === 'reception'} 
            onClick={() => setActiveView('reception')}
          />
          <SidebarItem 
            icon={<TrendingUp size={18} />} 
            label="Expédition" 
            active={activeView === 'picking'} 
            onClick={() => setActiveView('picking')}
          />
          <SidebarItem 
            icon={<Trash2 size={18} />} 
            label="Pertes/Vides" 
            active={activeView === 'consignes'} 
            onClick={() => setActiveView('consignes')}
          />
        </nav>

        <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
          {!isSuperAdmin && (
            <div className={`p-4 rounded-2xl border ${daysRemaining < 5 ? 'bg-rose-50 border-rose-100' : 'bg-emerald-50 border-emerald-100'} mb-2`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[10px] font-black uppercase ${daysRemaining < 5 ? 'text-rose-600' : 'text-emerald-600'}`}>Abonnement</span>
                <CalendarDays size={14} className={daysRemaining < 5 ? 'text-rose-400' : 'text-emerald-400'} />
              </div>
              <p className="text-xs font-bold text-slate-700">{daysRemaining} jours restants</p>
            </div>
          )}

          <SidebarItem 
            icon={<Settings size={18} />} 
            label="Paramètres" 
            active={activeView === 'settings'}
            onClick={() => setActiveView('settings')} 
          />
          
          <button 
            onClick={onLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-rose-500 hover:bg-rose-50 transition-all"
          >
            <LogOut size={18} />
            <span className="font-medium text-sm">Verrouiller</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 flex items-center justify-between z-30">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-bold text-slate-800">
              {isSuperAdmin ? 'Panel de Contrôle ELENA' : config.companyName}
            </h2>
          </div>
          <div className="flex items-center space-x-4">
             <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center space-x-2 ${
               isSuperAdmin ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-emerald-500 text-white shadow-lg shadow-emerald-100'
             }`}>
               {isSuperAdmin ? <Crown size={12} /> : <Lock size={12} />}
               <span>{isSuperAdmin ? 'PROPRIÉTAIRE' : 'ABONNÉ'}</span>
             </div>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
