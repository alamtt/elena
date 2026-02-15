
import { Beverage, Slot, ZoneType, StockItem, PackageUnit } from './types';

// Produits de démonstration pour Justin
export const INITIAL_BEVERAGES: Beverage[] = [
  { id: 'b1', name: 'Castel Beer 33cl', brand: 'BéBé', category: 'Bière', isFragile: true, requiresConsigne: true, consignePrice: 100 },
  { id: 'b2', name: 'Gazelle 65cl', brand: 'BéBé', category: 'Bière', isFragile: true, requiresConsigne: true, consignePrice: 200 },
  { id: 'b3', name: 'Youki Cocktail 50cl', brand: 'Youki', category: 'Soda', isFragile: false, requiresConsigne: true, consignePrice: 150 },
  { id: 'b4', name: 'Guinness Foreign Extra', brand: 'Guinness', category: 'Bière', isFragile: true, requiresConsigne: true, consignePrice: 250 },
  { id: 'b5', name: 'Eau Possotomé 1.5L', brand: 'Possotomé', category: 'Eau', isFragile: false, requiresConsigne: false }
];

// Stock initial pour visualiser la cartographie
export const INITIAL_STOCK: StockItem[] = [
  { 
    id: 's1', 
    beverageId: 'b1', 
    lotNumber: 'LOT-24-C01', 
    expiryDate: '2025-12-31', 
    quantity: 240, 
    unit: PackageUnit.CASE24, 
    slotId: 'S-1', 
    receivedDate: new Date().toISOString() 
  },
  { 
    id: 's2', 
    beverageId: 'b2', 
    lotNumber: 'LOT-24-G08', 
    expiryDate: '2025-06-15', 
    quantity: 120, 
    unit: PackageUnit.CASE12, 
    slotId: 'S-3', 
    receivedDate: new Date().toISOString() 
  }
];

export const MOCK_SLOTS: Slot[] = Array.from({ length: 20 }, (_, i) => ({
  id: `S-${i + 1}`,
  zone: i < 10 ? ZoneType.AMBIENT : i < 16 ? ZoneType.REFRIGERATED : ZoneType.COLD_STORAGE,
  row: String.fromCharCode(65 + Math.floor(i / 5)),
  level: (i % 5) + 1,
  maxCapacity: 500,
  currentLoad: 0,
}));
