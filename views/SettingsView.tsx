
import React, { useState } from 'react';
import { WarehouseConfig } from '../types';
import { Settings, Save, Hash, Building, UserCheck, Download, Upload, ShieldCheck } from 'lucide-react';

interface SettingsProps {
  config: WarehouseConfig;
  onUpdate: (config: WarehouseConfig) => void;
}

const SettingsView: React.FC<SettingsProps> = ({ config, onUpdate }) => {
  const [localConfig, setLocalConfig] = useState(config);

  const handleSave = () => {
    onUpdate(localConfig);
    alert("Paramètres de l'entreprise mis à jour avec succès.");
  };

  const exportData = () => {
    const data = {
      beverages: localStorage.getItem('bevo_beverages'),
      stock: localStorage.getItem('bevo_stock'),
      breakage: localStorage.getItem('bevo_breakage'),
      config: localStorage.getItem('bevo_config'),
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `elena_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (confirm("Attention : l'importation écrasera toutes vos données ELENA actuelles sur cet ordinateur. Continuer ?")) {
          if (data.beverages) localStorage.setItem('bevo_beverages', data.beverages);
          if (data.stock) localStorage.setItem('bevo_stock', data.stock);
          if (data.breakage) localStorage.setItem('bevo_breakage', data.breakage);
          if (data.config) localStorage.setItem('bevo_config', data.config);
          
          alert("Importation réussie ! L'application ELENA va se recharger.");
          window.location.reload();
        }
      } catch (err) {
        alert("Erreur : le fichier de sauvegarde est invalide.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Paramètres Généraux */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center space-x-3 mb-8">
            <Settings className="text-blue-600" />
            <h4 className="text-xl font-bold text-slate-800">Identité Entreprise</h4>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-500 uppercase flex items-center">
                <Building size={14} className="mr-2" /> Nom de l'Entreprise
              </label>
              <input 
                type="text"
                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                value={localConfig.companyName}
                onChange={(e) => setLocalConfig({...localConfig, companyName: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-500 uppercase flex items-center">
                <Hash size={14} className="mr-2" /> Numéro IFU (Bénin)
              </label>
              <input 
                type="text"
                placeholder="Ex: 1234567890123"
                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                value={localConfig.ifu}
                onChange={(e) => setLocalConfig({...localConfig, ifu: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-500 uppercase flex items-center">
                <UserCheck size={14} className="mr-2" /> Superviseur
              </label>
              <input 
                type="text"
                className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 outline-none font-semibold text-slate-600"
                value={localConfig.supervisor}
                readOnly
              />
            </div>

            <button 
              onClick={handleSave}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center space-x-2 hover:bg-black transition-all shadow-lg"
            >
              <Save size={20} />
              <span>Enregistrer Profil</span>
            </button>
          </div>
        </div>

        {/* Maintenance & Sécurité des Données */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center space-x-3 mb-8">
            <ShieldCheck className="text-emerald-600" />
            <h4 className="text-xl font-bold text-slate-800">Base de Données Locale ELENA</h4>
          </div>

          <p className="text-sm text-slate-500 mb-8 leading-relaxed">
            Justin, vos données sont stockées sur cet ordinateur. Pour ne rien perdre en cas de problème technique, exportez régulièrement une sauvegarde ELENA.
          </p>

          <div className="space-y-4">
            <button 
              onClick={exportData}
              className="w-full py-4 border-2 border-dashed border-blue-200 text-blue-700 rounded-2xl font-bold flex items-center justify-center space-x-3 hover:bg-blue-50 transition-all"
            >
              <Download size={20} />
              <span>Télécharger une Sauvegarde</span>
            </button>

            <div className="relative">
              <input 
                type="file" 
                accept=".json"
                onChange={importData}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <button className="w-full py-4 bg-slate-100 text-slate-700 rounded-2xl font-bold flex items-center justify-center space-x-3 hover:bg-slate-200 transition-all">
                <Upload size={20} />
                <span>Restaurer une Sauvegarde</span>
              </button>
            </div>
          </div>

          <div className="mt-8 p-4 bg-amber-50 rounded-xl border border-amber-100">
            <p className="text-[10px] text-amber-800 font-bold uppercase tracking-wider mb-1 text-center">Important</p>
            <p className="text-xs text-amber-700 text-center">
              Les fichiers de sauvegarde (.json) contiennent tout votre entrepôt ELENA. Gardez-les précieusement.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
