
import React from 'react';
import { AlertCircle, Zap, Archive, FlaskConical, ShieldCheck } from 'lucide-react';
import { StockItem, BreakageLog } from '../types';

interface DashboardProps {
  stock: StockItem[];
  breakageLogs: BreakageLog[];
}

const KPICard = ({ title, value, subValue, icon: Icon, color }: any) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-start justify-between">
    <div>
      <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
      <p className="text-xs text-slate-400 mt-2">{subValue}</p>
    </div>
    <div className={`${color} p-3 rounded-xl`}>
      <Icon className="text-white w-6 h-6" />
    </div>
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ stock, breakageLogs }) => {
  const totalStock = stock.reduce((acc, curr) => acc + curr.quantity, 0);
  const totalBreakage = breakageLogs.reduce((acc, curr) => acc + curr.qty, 0);
  const breakageValue = breakageLogs.reduce((acc, curr) => acc + curr.cost, 0);

  const formatFCFA = (amount: number) => {
    return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA';
  };

  return (
    <div className="space-y-8">
      {/* Offline Security Banner */}
      <div className="bg-blue-600 text-white p-4 rounded-2xl shadow-lg flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <ShieldCheck size={24} />
          <div>
            <h4 className="font-bold">Mode Hors-Ligne Sécurisé</h4>
            <p className="text-xs text-blue-100">Justin, toutes vos données sont stockées uniquement sur ce poste de travail.</p>
          </div>
        </div>
        <div className="hidden md:block px-3 py-1 bg-white/20 rounded-lg text-[10px] font-bold uppercase tracking-widest">
          Version Desktop 2.0
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard 
          title="Stock Total" 
          value={totalStock.toLocaleString()} 
          subValue="Unités en entrepôt" 
          icon={Archive} 
          color="bg-blue-600" 
        />
        <KPICard 
          title="Picking" 
          value="3" 
          subValue="Trajets optimisés prêts" 
          icon={Zap} 
          color="bg-amber-500" 
        />
        <KPICard 
          title="Alerte DLUO" 
          value="0" 
          subValue="Priorité FEFO" 
          icon={AlertCircle} 
          color="bg-rose-500" 
        />
        <KPICard 
          title="Pertes (Casse)" 
          value={formatFCFA(breakageValue)} 
          subValue={`${totalBreakage} bouteilles perdues`} 
          icon={FlaskConical} 
          color="bg-emerald-500" 
        />
      </div>

      {stock.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border-2 border-dashed border-slate-200 text-center">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
            <Archive size={32} />
          </div>
          <h3 className="text-xl font-bold text-slate-400">Base de données vide sur cet ordinateur</h3>
          <p className="text-slate-400 max-w-sm mx-auto mt-2">Justin, commencez par ajouter des produits au catalogue pour initialiser votre entrepôt local.</p>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
           <h4 className="font-bold text-slate-800 mb-6">Mouvements Récents (Flux Local)</h4>
           <div className="space-y-4">
              {stock.slice(-3).reverse().map(item => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold">
                      +{item.quantity}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">Entrée en Stock - Lot {item.lotNumber}</p>
                      <p className="text-xs text-slate-500">Reçu le {new Date(item.receivedDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="px-3 py-1 bg-white border border-slate-200 rounded-full text-[10px] font-bold text-slate-400 uppercase">Slot {item.slotId}</span>
                  </div>
                </div>
              ))}
           </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
