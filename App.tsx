
import React, { useState, useEffect, useMemo } from 'react';
import Layout from './components/Layout';
import Dashboard from './views/Dashboard';
import Inventory from './views/Inventory';
import WarehouseMap from './views/WarehouseMap';
import Reception from './views/Reception';
import Consignes from './views/Consignes';
import Catalog from './views/Catalog';
import Picking from './views/Picking';
import SettingsView from './views/SettingsView';
import Activation from './views/Activation';
import SuperAdmin from './views/SuperAdmin';
import { Beverage, StockItem, WarehouseConfig, BreakageLog, License } from './types';
import { INITIAL_BEVERAGES, INITIAL_STOCK } from './constants';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  // Initialisation de l'ID Machine unique (comme sur ta photo)
  const getMachineId = (): string => {
    try {
      let id = localStorage.getItem('elena_machine_id');
      if (!id) {
        const part1 = Math.random().toString(36).substring(2, 6).toUpperCase();
        const part2 = Math.random().toString(36).substring(2, 6).toUpperCase();
        id = `ELENA-${part1}-${part2}`;
        localStorage.setItem('elena_machine_id', id);
      }
      return id;
    } catch (error) {
      console.error('Erreur localStorage:', error);
      return 'ELENA-ERROR-' + Date.now();
    }
  };

  // État de la configuration (Correction du bloc try-catch et du type WarehouseConfig)
  const [config, setConfig] = useState<WarehouseConfig>(() => {
    const machineId = getMachineId();
    try {
      const saved = localStorage.getItem('elena_config');
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...parsed, machineId };
      }
    } catch (error) {
      console.error('Erreur chargement configuration:', error);
    }
    
    // Valeurs par défaut si le chargement échoue
    return {
      ifu: '',
      companyName: 'Mon Entrepôt',
      supervisor: 'Gérant Justin',
      isActive: false,
      expiryDate: undefined,
      machineId: machineId
    };
  });

  // Registre des licences locales
  const [masterRegistry, setMasterRegistry] = useState<License[]>(() => {
    try {
      const saved = localStorage.getItem('elena_master_registry');
      return saved ? JSON.parse(saved) : [
        { 
          key: '0000000000000000', 
          clientId: 'Justin (Propriétaire)', 
          expiryDate: '2099-12-31', 
          machineId: null, 
          durationDays: 30000, 
          status: 'Active' 
        }
      ];
    } catch {
      return [{ 
        key: '0000000000000000', 
        clientId: 'Justin (Propriétaire)', 
        expiryDate: '2099-12-31', 
        machineId: null, 
        durationDays: 30000, 
        status: 'Active' 
      }];
    }
  });

  // Sauvegarde automatique vers localStorage
  useEffect(() => {
    try {
      localStorage.setItem('elena_master_registry', JSON.stringify(masterRegistry));
      localStorage.setItem('elena_config', JSON.stringify(config));
    } catch (e) {
      console.error("Échec de sauvegarde locale", e);
    }
  }, [masterRegistry, config]);

  // Activation du logiciel
  const handleActivation = (rawKey: string) => {
    const key = rawKey.replace(/[- ]/g, '').trim();
    const currentMachineId = config.machineId;
    
    const licenseIndex = masterRegistry.findIndex(l => l.key === key);

    if (licenseIndex === -1) {
      alert("Code d'activation ELENA invalide. Contactez Justin.");
      return;
    }

    const license = masterRegistry[licenseIndex];

    if (license.machineId && license.machineId !== currentMachineId) {
      alert("ERREUR : Cette licence est verrouillée sur un autre ordinateur.");
      return;
    }

    const updatedRegistry = [...masterRegistry];
    updatedRegistry[licenseIndex] = { ...license, machineId: currentMachineId };
    setMasterRegistry(updatedRegistry);

    setConfig(prev => ({
      ...prev,
      isActive: true,
      licenseKey: key,
      expiryDate: license.expiryDate
    }));
    
    if (key === '0000000000000000') setActiveView('dashboard');
  };

  const generateNewKey = (clientId: string, days: number) => {
    const part1 = Math.random().toString(36).substring(2, 6).toUpperCase();
    const part2 = Math.random().toString(36).substring(2, 6).toUpperCase();
    const newKey = `ELENA-${part1}-${part2}`;
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + days);
    
    const newLicense: License = {
      key: newKey.replace(/-/g, ''),
      clientId: clientId,
      expiryDate: expiry.toISOString(),
      machineId: null,
      durationDays: days,
      status: 'Active'
    };

    setMasterRegistry(prev => [...prev, newLicense]);
    return newKey;
  };

  // --- Gestion des données métier (Boissons, Stock, Casse) ---
  const [beverages, setBeverages] = useState<Beverage[]>(() => {
    const saved = localStorage.getItem('bevo_beverages');
    return saved ? JSON.parse(saved) : INITIAL_BEVERAGES;
  });

  const [stock, setStock] = useState<StockItem[]>(() => {
    const saved = localStorage.getItem('bevo_stock');
    return saved ? JSON.parse(saved) : INITIAL_STOCK;
  });

  const [breakageLogs, setBreakageLogs] = useState<BreakageLog[]>(() => {
    const saved = localStorage.getItem('bevo_breakage');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('bevo_beverages', JSON.stringify(beverages));
    localStorage.setItem('bevo_stock', JSON.stringify(stock));
    localStorage.setItem('bevo_breakage', JSON.stringify(breakageLogs));
  }, [beverages, stock, breakageLogs]);

  const isJustin = useMemo(() => config.licenseKey === '0000000000000000', [config.licenseKey]);

  // Si l'application n'est pas activée, afficher la vue d'activation
  if (!config.isActive) {
    return <Activation onActivate={handleActivation} />;
  }

  return (
    <Layout 
      activeView={activeView} 
      setActiveView={setActiveView} 
      config={config}
      onInstall={() => deferredPrompt?.prompt()}
      showInstall={!!deferredPrompt}
      onLogout={() => {
        if (confirm("Voulez-vous verrouiller l'application ?")) {
          setConfig(prev => ({ ...prev, isActive: false }));
        }
      }}
      isSuperAdmin={isJustin}
    >
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {activeView === 'superadmin' && isJustin && (
          <SuperAdmin 
            licenses={masterRegistry} 
            onGenerate={generateNewKey} 
            onRevoke={(key) => setMasterRegistry(prev => prev.filter(l => l.key !== key))}
          />
        )}
        {activeView === 'dashboard' && <Dashboard stock={stock} breakageLogs={breakageLogs} />}
        {activeView === 'catalog' && (
          <Catalog 
            beverages={beverages} 
            onAdd={(b) => setBeverages([...beverages, b])} 
            onDelete={(id) => {
              setBeverages(beverages.filter(b => b.id !== id));
              setStock(stock.filter(s => s.beverageId !== id));
            }} 
          />
        )}
        {activeView === 'inventory' && (
          <Inventory 
            stock={stock} 
            beverages={beverages} 
            onDelete={(id) => setStock(stock.filter(s => s.id !== id))} 
          />
        )}
        {activeView === 'map' && <WarehouseMap stock={stock} />}
        {activeView === 'reception' && (
          <Reception 
            beverages={beverages} 
            onSave={(item) => setStock([...stock, item])} 
          />
        )}
        {activeView === 'picking' && (
          <Picking 
            stock={stock} 
            beverages={beverages} 
            config={config}
          />
        )}
        {activeView === 'consignes' && (
          <Consignes 
            breakageLogs={breakageLogs} 
            onAddBreakage={(log) => setBreakageLogs([log, ...breakageLogs])} 
          />
        )}
        {activeView === 'settings' && (
          <SettingsView 
            config={config} 
            onUpdate={setConfig} 
          />
        )}
      </div>
    </Layout>
  );
};

export default App;
