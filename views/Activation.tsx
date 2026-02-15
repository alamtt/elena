
import React, { useState } from 'react';
import { Key, ShieldCheck, CreditCard, Cpu, Loader2 } from 'lucide-react';

interface ActivationProps {
  onActivate: (key: string) => void;
}

const Activation: React.FC<ActivationProps> = ({ onActivate }) => {
  const [key, setKey] = useState('');
  const [loading, setLoading] = useState(false);
  const machineId = localStorage.getItem('elena_machine_id') || 'Chargement...';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (key.trim()) {
      setLoading(true);
      // Petite pause pour l'effet visuel avant activation
      setTimeout(() => {
        onActivate(key.trim());
        setLoading(false);
      }, 500);
    } else {
      alert("Veuillez saisir une clé d'activation.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 font-sans select-none">
      <div className="max-w-md w-full bg-white rounded-[3rem] shadow-2xl overflow-hidden p-10 relative border-4 border-slate-800">
        <div className="absolute top-0 right-0 p-8">
           <div className="w-3 h-3 bg-rose-500 rounded-full animate-pulse shadow-lg shadow-rose-200"></div>
        </div>

        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-blue-600 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-blue-200 transform hover:rotate-12 transition-transform duration-300">
            <Key className="text-white" size={40} />
          </div>
          <h1 className="text-3xl font-black text-slate-800 mb-2 tracking-tighter uppercase">ELENA Logistique</h1>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Logiciel de Gestion par Justin</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-3xl space-y-3 shadow-inner">
            <div className="flex items-center space-x-2 text-slate-400">
              <Cpu size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest">ID Machine (Verrouillage)</span>
            </div>
            <p className="text-sm font-mono font-black text-slate-700 tracking-wider text-center bg-white p-2 rounded-xl border border-slate-100">
               {machineId}
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Saisir votre Clé d'Activation</label>
            <input 
              type="text" 
              placeholder="0000-0000-0000-0000"
              className="w-full p-5 bg-slate-50 border border-slate-200 rounded-[2rem] text-center font-mono text-xl focus:ring-4 focus:ring-blue-100 outline-none uppercase font-black transition-all placeholder:text-slate-200"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              disabled={loading}
              autoFocus
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black text-lg shadow-2xl hover:bg-blue-600 transition-all transform active:scale-95 flex items-center justify-center space-x-3"
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <span className="tracking-widest">ACTIVER LE LOGICIEL</span>
            )}
          </button>

          <div className="pt-6 border-t border-slate-100 text-center">
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-tighter mb-4">Besoin d'aide ou d'une clé ?</p>
            <div className="inline-flex items-center space-x-2 text-blue-600 font-black text-sm cursor-pointer hover:text-blue-700 transition-colors">
              <CreditCard size={16} />
              <span>Contactez Justin (Support ELENA)</span>
            </div>
          </div>
        </form>
        
        <div className="mt-8 flex items-center justify-center space-x-2 text-[8px] text-slate-300 font-black uppercase tracking-[0.2em]">
          <ShieldCheck size={12} />
          <span>Sécurité Hardware Activée</span>
        </div>
      </div>
    </div>
  );
};

export default Activation;
