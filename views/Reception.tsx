
import React, { useState, useEffect, useRef } from 'react';
import { MOCK_SLOTS } from '../constants';
import { Beverage, StockItem, PackageUnit } from '../types';
import { QrCode, ClipboardCheck, AlertTriangle, Save, Loader2, Info, Camera, X, Check } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';

interface ReceptionProps {
  beverages: Beverage[];
  onSave: (item: StockItem) => void;
}

const Reception: React.FC<ReceptionProps> = ({ beverages, onSave }) => {
  const [scanning, setScanning] = useState(false);
  const [realScanning, setRealScanning] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);

  const [formData, setFormData] = useState({
    beverageId: '',
    lot: '',
    expiry: '',
    quantity: 0,
    slot: '',
    hasDamage: false
  });

  // Gestion du scanner réel
  useEffect(() => {
    if (realScanning) {
      const html5QrCode = new Html5Qrcode("reader");
      scannerRef.current = html5QrCode;

      const config = { fps: 10, qrbox: { width: 250, height: 250 } };

      html5QrCode.start(
        { facingMode: "environment" },
        config,
        (decodedText) => {
          try {
            const data = JSON.parse(decodedText);
            setFormData(prev => ({
              ...prev,
              beverageId: data.beverageId || data.id || prev.beverageId,
              lot: data.lot || prev.lot,
              expiry: data.expiry || prev.expiry,
              quantity: data.qty || data.quantity || prev.quantity
            }));
            stopRealScan();
            alert("Scan réussi ! Les informations ont été extraites.");
          } catch (e) {
            const foundBev = beverages.find(b => b.id === decodedText);
            if (foundBev) {
              setFormData(prev => ({ 
                ...prev, 
                beverageId: foundBev.id,
                lot: foundBev.lotNumber || prev.lot,
                expiry: foundBev.expiryDate || prev.expiry
              }));
              stopRealScan();
              alert(`Produit identifié : ${foundBev.name}`);
            } else {
              setFormData(prev => ({ ...prev, lot: decodedText }));
              stopRealScan();
              alert(`Texte scanné (attribué au lot) : ${decodedText}`);
            }
          }
        },
        () => {}
      ).catch(err => {
        console.error("Erreur d'initialisation caméra:", err);
        alert("Impossible d'accéder à la caméra.");
        setRealScanning(false);
      });
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(console.error);
      }
    };
  }, [realScanning, beverages]);

  const stopRealScan = () => {
    if (scannerRef.current) {
      scannerRef.current.stop().then(() => {
        setRealScanning(false);
      }).catch(err => {
        console.error(err);
        setRealScanning(false);
      });
    } else {
      setRealScanning(false);
    }
  };

  const handleBeverageChange = (id: string) => {
    const selected = beverages.find(b => b.id === id);
    setFormData({
      ...formData,
      beverageId: id,
      lot: selected?.lotNumber || formData.lot,
      expiry: selected?.expiryDate || formData.expiry
    });
  };

  const handleSimulatedScan = () => {
    if (beverages.length === 0) return alert("Veuillez d'abord ajouter des produits au catalogue.");
    setScanning(true);
    setTimeout(() => {
      const randomBev = beverages[Math.floor(Math.random() * beverages.length)];
      setFormData({
        ...formData,
        beverageId: randomBev.id,
        lot: randomBev.lotNumber || `LOT-${Math.floor(1000 + Math.random() * 9000)}`,
        expiry: randomBev.expiryDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        quantity: 50
      });
      setScanning(false);
    }, 1200);
  };

  const handleManualSave = () => {
    if (!formData.beverageId || !formData.lot || formData.quantity <= 0 || !formData.slot) {
      return alert("Veuillez remplir tous les champs obligatoires (Produit, Lot, Quantité, Slot).");
    }

    const newItem: StockItem = {
      id: `st-${Date.now()}`,
      beverageId: formData.beverageId,
      lotNumber: formData.lot,
      expiryDate: formData.expiry || new Date().toISOString(),
      quantity: formData.quantity,
      unit: PackageUnit.CASE24,
      slotId: formData.slot,
      receivedDate: new Date().toISOString()
    };

    onSave(newItem);
    alert("Réception enregistrée définitivement. Le stock est mis à jour.");
    
    setFormData({
      beverageId: '',
      lot: '',
      expiry: '',
      quantity: 0,
      slot: '',
      hasDamage: false
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-3xl text-white shadow-xl flex flex-col items-center text-center">
        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md">
          <QrCode size={32} />
        </div>
        <h3 className="text-2xl font-bold mb-2">Identifier la Marchandise</h3>
        <p className="text-blue-100 mb-8 max-w-md">Utilisez la caméra pour scanner les QR codes ou simulez un scan pour tester le flux de réception.</p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <button 
            onClick={() => setRealScanning(true)}
            disabled={realScanning}
            className="px-8 py-3 bg-white text-blue-700 rounded-xl font-bold hover:bg-blue-50 transition-all flex items-center justify-center space-x-3 shadow-lg"
          >
            <Camera size={20} />
            <span>Ouvrir Scanner Caméra</span>
          </button>
          
          <button 
            onClick={handleSimulatedScan}
            disabled={scanning || realScanning || beverages.length === 0}
            className="px-8 py-3 bg-blue-500/30 text-white border border-white/20 rounded-xl font-bold hover:bg-white/20 transition-all flex items-center justify-center space-x-3 disabled:opacity-50"
          >
            {scanning ? <Loader2 className="animate-spin" /> : <QrCode size={20} />}
            <span>{scanning ? 'Numérisation...' : 'Simulation Scan'}</span>
          </button>
        </div>
      </div>

      {realScanning && (
        <div className="bg-slate-900 rounded-3xl overflow-hidden shadow-2xl relative aspect-video sm:aspect-auto sm:h-[400px]">
          <div id="reader"></div>
          <div className="absolute top-4 right-4 z-10">
            <button 
              onClick={stopRealScan}
              className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-all"
            >
              <X size={24} />
            </button>
          </div>
          <div className="absolute inset-x-0 bottom-8 flex justify-center pointer-events-none">
            <div className="px-4 py-2 bg-black/60 backdrop-blur-md rounded-full border border-white/10 text-white text-xs font-bold uppercase tracking-widest">
              Alignez le code QR dans le cadre
            </div>
          </div>
        </div>
      )}

      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
        {(formData.beverageId || formData.lot) && !realScanning && !scanning && (
          <div className="absolute top-4 right-4 flex items-center space-x-2 text-emerald-600 animate-bounce">
            <Check size={16} />
            <span className="text-[10px] font-bold uppercase tracking-tighter">Données scannées</span>
          </div>
        )}

        <div className="flex items-center space-x-3 mb-8">
          <ClipboardCheck className="text-blue-600" />
          <h4 className="text-xl font-bold text-slate-800">Formulaire d'Entrée Immuable</h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-600">Produit Catalogué</label>
            <select 
              className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              value={formData.beverageId}
              onChange={(e) => handleBeverageChange(e.target.value)}
            >
              <option value="">-- Choisir une référence --</option>
              {beverages.map(b => <option key={b.id} value={b.id}>{b.name} ({b.brand})</option>)}
            </select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-600">N° de Lot (Traçabilité)</label>
            <input 
              type="text"
              placeholder="Ex: L2024-X12"
              className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              value={formData.lot}
              onChange={(e) => setFormData({...formData, lot: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-600">DLUO / Expiration</label>
            <input 
              type="date"
              className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.expiry}
              onChange={(e) => setFormData({...formData, expiry: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-600">Quantité (Unités)</label>
            <input 
              type="number"
              className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.quantity || ''}
              onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value) || 0})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-600">Slot de Rangement</label>
            <select 
              className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.slot}
              onChange={(e) => setFormData({...formData, slot: e.target.value})}
            >
              <option value="">Assigner un emplacement</option>
              {MOCK_SLOTS.map(s => <option key={s.id} value={s.id}>{s.id} - {s.zone}</option>)}
            </select>
          </div>
        </div>

        <div className="mt-8 p-4 bg-amber-50 rounded-xl border border-amber-100 flex items-start space-x-3">
          <Info size={20} className="text-amber-600 mt-0.5" />
          <p className="text-sm text-amber-800">
            <strong>Rappel Logistique :</strong> Vérifiez l'intégrité des bouteilles avant de valider. Une fois le stock validé, ce reçu devient définitif dans le registre de Justin.
          </p>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-100">
          <button 
            onClick={handleManualSave}
            className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold flex items-center justify-center space-x-2 hover:bg-blue-700 transition-all shadow-lg"
          >
            <Save size={20} />
            <span>Valider l'Entrée en Stock</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Reception;
