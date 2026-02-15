
import React, { useState } from 'react';
import { UserPlus, Key, Users, Calendar, Search, Trash2, Cpu, Copy, Check } from 'lucide-react';
import { License } from '../types';

interface SuperAdminProps {
  licenses: License[];
  onGenerate: (client: string, days: number) => string;
  onRevoke: (key: string) => void;
}

const SuperAdmin: React.FC<SuperAdminProps> = ({ licenses, onGenerate, onRevoke }) => {
  const [newClient, setNewClient] = useState('');
  const [duration, setDuration] = useState(30);
  const [generatedKey, setGeneratedKey] = useState('');
  const [copied, setCopied] = useState(false);

  const handleCreate = () => {
    if (!newClient) return alert("Nom du client requis");
    const key = onGenerate(newClient, duration);
    setGeneratedKey(key);
    setNewClient('');
    setCopied(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Fonction pour afficher la clé avec des tirets pour le client
  const formatKeyDisplay = (key: string) => {
    if (key === '0000000000000000') return '0000-0000-0000-0000';
    if (key.startsWith('ELENA')) {
       // Si la clé contient déjà ELENA, on la laisse tel quel ou on ajoute des tirets
       return key;
    }
    return key.match(/.{1,4}/g)?.join('-') || key;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Console Justin - ELENA Master</h2>
          <p className="text-slate-500">Contrôle total des abonnements et accès matériels.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
          <h3 className="text-lg font-black text-slate-800 flex items-center">
            <Key className="mr-2 text-blue-600" size={20} /> Nouveau Client
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Nom du Client / Entrepôt</label>
              <input 
                type="text" 
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                placeholder="Ex: Brasserie du Littoral"
                value={newClient}
                onChange={(e) => setNewClient(e.target.value)}
              />
            </div>
            
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Durée de l'Abonnement</label>
              <select 
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value))}
              >
                <option value={30}>30 Jours (Standard)</option>
                <option value={90}>90 Jours (Trimestre)</option>
                <option value={365}>365 Jours (Annuel)</option>
              </select>
            </div>

            <button 
              onClick={handleCreate}
              className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all flex items-center justify-center space-x-2"
            >
              <UserPlus size={20} />
              <span>Générer Clé d'Abonnement</span>
            </button>
          </div>

          {generatedKey && (
            <div className="p-6 bg-slate-900 rounded-3xl animate-in slide-in-from-top-4">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Clé à envoyer au client :</p>
              <div className="flex items-center justify-between">
                <code className="text-blue-400 font-mono font-bold text-sm">{generatedKey}</code>
                <button 
                  onClick={copyToClipboard}
                  className="p-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all"
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h4 className="font-black text-slate-800 flex items-center">
              <Users size={20} className="mr-2 text-blue-600" /> Registre Clients ELENA
            </h4>
          </div>
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Client</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Machine</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Expiration</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {licenses.map(l => (
                  <tr key={l.key} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-black text-slate-800">{l.clientId}</p>
                      <p className="text-[10px] font-mono text-blue-600 uppercase tracking-tighter">Code: {formatKeyDisplay(l.key)}</p>
                    </td>
                    <td className="px-6 py-4">
                      {l.machineId ? (
                        <div className="flex items-center space-x-2 text-emerald-600 font-bold text-xs bg-emerald-50 px-3 py-1 rounded-full w-fit">
                          <Cpu size={12} />
                          <span>{l.machineId}</span>
                        </div>
                      ) : (
                        <span className="text-[10px] font-bold text-slate-300 uppercase italic tracking-widest">En attente...</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2 text-sm font-bold text-slate-600">
                        <Calendar size={14} className="text-slate-400" />
                        <span>{new Date(l.expiryDate).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {l.key !== '0000000000000000' && (
                        <button 
                          onClick={() => confirm("Révoquer l'accès pour ce client ?") && onRevoke(l.key)}
                          className="p-3 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdmin;
