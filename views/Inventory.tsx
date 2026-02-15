
import React, { useState } from 'react';
import { StockItem, Beverage } from '../types';
import { Search, Filter, Calendar, Package, Trash2, Box } from 'lucide-react';

interface InventoryProps {
  stock: StockItem[];
  beverages: Beverage[];
  onDelete: (id: string) => void;
}

const Inventory: React.FC<InventoryProps> = ({ stock, beverages, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const getBeverageName = (id: string) => beverages.find(b => b.id === id)?.name || 'Produit Supprimé';

  const filteredStock = stock.filter(item => 
    getBeverageName(item.beverageId).toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.lotNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Chercher dans le stock Justin..." 
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
            <Filter size={18} />
            <span className="font-medium">Filtres</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Lot</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Produit</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Stock</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Emplacement</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">DLUO</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Gestion</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredStock.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-400 italic">
                  Aucun stock enregistré pour le moment.
                </td>
              </tr>
            ) : (
              filteredStock.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-sm text-slate-500">{item.lotNumber}</td>
                  <td className="px-6 py-4 font-semibold text-slate-700">{getBeverageName(item.beverageId)}</td>
                  <td className="px-6 py-4 font-bold text-blue-600">{item.quantity}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs font-bold border border-slate-200">
                      {item.slotId}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2 text-slate-600 text-sm">
                      <Calendar size={14} />
                      <span>{new Date(item.expiryDate).toLocaleDateString('fr-FR')}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => onDelete(item.id)}
                      className="p-2 text-slate-300 hover:text-rose-500 transition-colors"
                      title="Sortie de stock / Casse"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-center space-x-4">
           <Box className="text-blue-600" />
           <div>
             <h4 className="text-sm font-bold text-blue-800">Total Références</h4>
             <p className="text-xl font-bold text-blue-900">{filteredStock.length}</p>
           </div>
        </div>
        <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center space-x-4">
           <Package className="text-indigo-600" />
           <div>
             <h4 className="text-sm font-bold text-indigo-800">Unités Totales</h4>
             <p className="text-xl font-bold text-indigo-900">
               {filteredStock.reduce((acc, curr) => acc + curr.quantity, 0)}
             </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
