
import React, { useState } from 'react';
import { Play, CheckCircle, Navigation, Package, MapPin, FileText, X, Printer, Hash } from 'lucide-react';
import { StockItem, Beverage, WarehouseConfig } from '../types';

interface PickingProps {
  stock: StockItem[];
  beverages: Beverage[];
  config: WarehouseConfig;
}

const Picking: React.FC<PickingProps> = ({ stock, beverages, config }) => {
  const [showReceipt, setShowReceipt] = useState(false);

  // Simulation d'une commande à partir du stock actuel (FEFO)
  const pickingItems = stock.slice(0, 3).map(item => ({
    id: item.id,
    slot: item.slotId,
    product: beverages.find(b => b.id === item.beverageId)?.name || 'Produit',
    qty: Math.min(item.quantity, 10),
    unit: item.unit
  }));

  return (
    <div className="space-y-8">
      {/* Route Optimization Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center space-x-4 mb-4 md:mb-0">
          <div className="bg-blue-600 p-3 rounded-2xl text-white shadow-lg shadow-blue-100">
            <Navigation size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800">Picking en cours</h3>
            <p className="text-slate-500 text-sm">Justin, suivez le trajet optimisé pour la collecte.</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
            <button 
              onClick={() => setShowReceipt(true)}
              className="px-6 py-3 border border-slate-200 text-slate-700 rounded-xl font-bold flex items-center space-x-2 hover:bg-slate-50 transition-all"
            >
              <FileText size={18} />
              <span>Aperçu Reçu Client</span>
            </button>
            <button className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold flex items-center space-x-2 hover:bg-slate-800 transition-all">
              <Play size={18} fill="currentColor" />
              <span>Lancer Trajet</span>
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest pl-2">Articles à collecter ({pickingItems.length})</h4>
          {pickingItems.length === 0 ? (
            <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center text-slate-400">
                <Package size={48} className="mx-auto mb-4 opacity-20" />
                <p>Aucun stock disponible pour le picking.</p>
            </div>
          ) : (
            pickingItems.map((item, idx) => (
              <div key={item.id} className="bg-white p-6 rounded-2xl border border-slate-200 flex items-center justify-between group hover:border-blue-500 transition-all">
                <div className="flex items-center space-x-6">
                  <div className="flex flex-col items-center">
                    <div className="text-[10px] font-bold text-slate-400 mb-1">STOP {idx + 1}</div>
                    <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-blue-600 border border-slate-200 font-bold">
                      {item.slot}
                    </div>
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-800 text-lg">{item.product}</h5>
                    <div className="flex items-center space-x-3 mt-1 text-sm text-slate-500">
                      <span className="flex items-center"><Package size={14} className="mr-1" /> {item.qty} {item.unit}</span>
                      <span className="flex items-center"><MapPin size={14} className="mr-1" /> Allée {item.slot.split('-')[0]}</span>
                    </div>
                  </div>
                </div>
                <button className="w-12 h-12 rounded-full border-2 border-slate-200 flex items-center justify-center text-slate-300 hover:border-emerald-500 hover:text-emerald-500 transition-all">
                  <CheckCircle size={24} />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl">
            <h4 className="font-bold text-lg mb-6">Récapitulatif Expédition</h4>
            <div className="space-y-4">
              <div className="flex justify-between text-slate-400 text-sm">
                <span>Superviseur</span>
                <span className="text-white font-bold">{config.supervisor}</span>
              </div>
              <div className="flex justify-between text-slate-400 text-sm">
                <span>IFU Entreprise</span>
                <span className="text-white font-bold font-mono text-xs">{config.ifu || 'Non défini'}</span>
              </div>
              <div className="pt-4 mt-4 border-t border-white/10 flex justify-between items-center">
                <span className="text-slate-400 text-sm">Statut Commande</span>
                <span className="px-3 py-1 bg-amber-500/20 text-amber-500 rounded-full text-xs font-bold uppercase tracking-tighter">En Préparation</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Reçu Client */}
      {showReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 className="font-bold text-slate-800 flex items-center">
                    <FileText size={20} className="mr-2 text-blue-600" />
                    Bon de Livraison / Reçu Client
                </h3>
                <button onClick={() => setShowReceipt(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                    <X size={20} />
                </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-10 bg-white" id="receipt-content">
                {/* Header Reçu */}
                <div className="text-center mb-10">
                    <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">{config.companyName}</h2>
                    <p className="text-slate-500 text-sm font-medium">Entrepôt de Boissons - Logistique Professionnelle</p>
                    <div className="mt-4 flex flex-col items-center space-y-1">
                        <span className="flex items-center px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold border border-blue-100 uppercase tracking-widest">
                            <Hash size={12} className="mr-1" />
                            IFU: {config.ifu || '____________________'}
                        </span>
                        <p className="text-xs text-slate-400">Date: {new Date().toLocaleDateString('fr-FR')} | Superviseur: {config.supervisor}</p>
                    </div>
                </div>

                {/* Table Articles */}
                <div className="border-t-2 border-b-2 border-slate-100 py-6 mb-8">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">
                                <th className="pb-4">Désignation Produit</th>
                                <th className="pb-4 text-center">Qté</th>
                                <th className="pb-4 text-right">Unités</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {pickingItems.length > 0 ? pickingItems.map(item => (
                                <tr key={item.id}>
                                    <td className="py-4 font-bold text-slate-700">{item.product}</td>
                                    <td className="py-4 text-center font-mono">{item.qty}</td>
                                    <td className="py-4 text-right text-slate-500">{item.unit}</td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={3} className="py-10 text-center italic text-slate-300">Aucun article enregistré</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer Reçu */}
                <div className="flex justify-between items-start pt-4">
                    <div className="text-[10px] text-slate-400 uppercase font-bold space-y-1">
                        <p>Validé par le système ELENA</p>
                        <p>ID Transaction: {Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                    </div>
                    <div className="text-right">
                        <div className="w-24 h-24 border border-slate-100 rounded bg-slate-50 flex items-center justify-center mx-auto mb-2 text-[8px] text-slate-300 uppercase font-bold">Cachet / Signature</div>
                    </div>
                </div>
            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-200 flex space-x-4">
                <button 
                  onClick={() => window.print()} 
                  className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-bold flex items-center justify-center space-x-2 shadow-lg shadow-blue-100"
                >
                    <Printer size={20} />
                    <span>Imprimer le Bon</span>
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Picking;
