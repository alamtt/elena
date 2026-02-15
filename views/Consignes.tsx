
import React, { useState } from 'react';
import { PackageX, RotateCcw, TrendingDown, DollarSign, History, Trash2, MonitorCheck } from 'lucide-react';
import { BreakageLog } from '../types';

interface ConsignesProps {
  breakageLogs: BreakageLog[];
  onAddBreakage: (log: BreakageLog) => void;
}

const Consignes: React.FC<ConsignesProps> = ({ breakageLogs, onAddBreakage }) => {
  const [returnedDeposits, setReturnedDeposits] = useState(0);
  const [customerBalance, setCustomerBalance] = useState(0);

  const formatFCFA = (amount: number) => {
    return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA';
  };

  const totalBreakageCost = breakageLogs.reduce((acc, log) => acc + log.cost, 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Status Bar Desktop Only */}
      <div className="flex items-center space-x-2 px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-lg text-emerald-700 w-fit">
        <MonitorCheck size={16} />
        <span className="text-xs font-bold uppercase tracking-widest">ELENA Logistique - Station Locale Active</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-rose-100 p-2 rounded-lg text-rose-600">
              <PackageX size={20} />
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Pertes</span>
          </div>
          <p className="text-sm text-slate-500 font-medium">Casse Totale (Locale)</p>
          <h3 className="text-2xl font-bold text-slate-800">{formatFCFA(totalBreakageCost)}</h3>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600">
              <RotateCcw size={20} />
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Récupération</span>
          </div>
          <p className="text-sm text-slate-500 font-medium">Consignes Retournées</p>
          <h3 className="text-2xl font-bold text-slate-800">{returnedDeposits} unités</h3>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
              <DollarSign size={20} />
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Comptabilité</span>
          </div>
          <p className="text-sm text-slate-500 font-medium">Solde Consignes Clients</p>
          <h3 className="text-2xl font-bold text-slate-800">{formatFCFA(customerBalance)}</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h3 className="text-lg font-bold text-slate-800">Journal de Casse Interne</h3>
            <button className="text-rose-600 text-sm font-bold flex items-center hover:bg-rose-50 px-3 py-1.5 rounded-lg transition-colors">
              <TrendingDown size={14} className="mr-1" /> Signaler Casse
            </button>
          </div>
          <div className="flex-1 max-h-[400px] overflow-y-auto">
            {breakageLogs.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-200">
                  <Trash2 size={32} />
                </div>
                <p className="text-slate-400 font-medium italic">Aucun incident enregistré sur cet ordinateur.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {breakageLogs.map(log => (
                  <div key={log.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-rose-50 text-rose-500 rounded flex items-center justify-center text-xs font-bold">-{log.qty}</div>
                      <div>
                        <p className="font-semibold text-slate-800 text-sm">{log.item}</p>
                        <p className="text-xs text-slate-400">{log.user} • {log.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-slate-700">{formatFCFA(log.cost)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
            <History size={20} className="mr-2 text-blue-600" />
            Nouveau Retour de Vides
          </h3>
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Client</label>
              <select className="w-full mt-1 p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                <option value="">-- Sélectionner un client --</option>
                <option>Cotonou Palace</option>
                <option>Bar des Étoiles</option>
                <option>Maquis du Centre</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Bouteilles</label>
                <input type="number" placeholder="Quantité" className="w-full mt-1 p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Casiers/Palettes</label>
                <input type="number" placeholder="Quantité" className="w-full mt-1 p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
              <div className="flex justify-between items-center text-emerald-800 font-bold">
                <span className="text-xs uppercase tracking-tight">Crédit à générer</span>
                <span>{formatFCFA(0)}</span>
              </div>
            </div>
            <button className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all">
              Valider le Retour
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Consignes;
