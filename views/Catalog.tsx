
import React, { useState } from 'react';
import { Beverage } from '../types';
import { Plus, Trash2, Tag, ShoppingBag, Hash, Calendar } from 'lucide-react';

interface CatalogProps {
  beverages: Beverage[];
  onAdd: (b: Beverage) => void;
  onDelete: (id: string) => void;
}

const Catalog: React.FC<CatalogProps> = ({ beverages, onAdd, onDelete }) => {
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('Bière');
  const [lotNumber, setLotNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !brand) return;
    onAdd({
      id: `b-${Date.now()}`,
      name,
      brand,
      category,
      isFragile: false,
      requiresConsigne: false,
      lotNumber: lotNumber || undefined,
      expiryDate: expiryDate || undefined
    });
    setName('');
    setBrand('');
    setLotNumber('');
    setExpiryDate('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Formulaire d'ajout */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-fit">
        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
          <Plus size={20} className="mr-2 text-blue-600" />
          Nouveau Produit
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nom de la boisson</label>
            <input 
              type="text" 
              className="w-full mt-1 p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" 
              placeholder="Ex: IPA Galaxy"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Marque / Brasserie</label>
            <input 
              type="text" 
              className="w-full mt-1 p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" 
              placeholder="Ex: Brasserie du Sud"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Catégorie</label>
              <select 
                className="w-full mt-1 p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option>Bière</option>
                <option>Jus</option>
                <option>Spiritueux</option>
                <option>Soda</option>
                <option>Vin</option>
              </select>
            </div>
            <div>
               <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Lot (Par déf.)</label>
               <input 
                type="text" 
                className="w-full mt-1 p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" 
                placeholder="Ex: BATCH-01"
                value={lotNumber}
                onChange={(e) => setLotNumber(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Expiration (Par déf.)</label>
            <input 
              type="date" 
              className="w-full mt-1 p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
            />
          </div>
          <button className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
            Enregistrer le Produit
          </button>
        </form>
      </div>

      {/* Liste du catalogue */}
      <div className="lg:col-span-2 space-y-4">
        <h3 className="text-lg font-bold text-slate-800 mb-4 px-2">Catalogue des Références ({beverages.length})</h3>
        {beverages.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center">
            <ShoppingBag size={48} className="mx-auto text-slate-200 mb-4" />
            <p className="text-slate-400 font-medium">Aucun produit dans le catalogue. Justin, commencez par en ajouter un.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {beverages.map((b) => (
              <div key={b.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col group">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-4">
                    <div className="bg-slate-100 p-3 rounded-xl text-slate-400">
                      <Tag size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800">{b.name}</h4>
                      <p className="text-xs text-slate-500 font-medium">{b.brand} • {b.category}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => onDelete(b.id)}
                    className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                
                {(b.lotNumber || b.expiryDate) && (
                  <div className="pt-3 border-t border-slate-50 flex items-center space-x-4">
                    {b.lotNumber && (
                      <div className="flex items-center text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                        <Hash size={12} className="mr-1" /> Lot: {b.lotNumber}
                      </div>
                    )}
                    {b.expiryDate && (
                      <div className="flex items-center text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                        <Calendar size={12} className="mr-1" /> Exp: {new Date(b.expiryDate).toLocaleDateString('fr-FR')}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Catalog;
