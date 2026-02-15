
export enum ZoneType {
  AMBIENT = 'Ambiante',
  REFRIGERATED = 'Réfrigérée',
  COLD_STORAGE = 'Chambre Froide'
}

export enum PackageUnit {
  BOTTLE = 'Bouteille',
  PACK6 = 'Pack x6',
  CASE12 = 'Caisse x12',
  CASE24 = 'Caisse x24',
  PALLET = 'Palette'
}

export interface Beverage {
  id: string;
  name: string;
  category: string;
  brand: string;
  isFragile: boolean;
  requiresConsigne: boolean;
  consignePrice?: number;
  lotNumber?: string;
  expiryDate?: string;
}

export interface StockItem {
  id: string;
  beverageId: string;
  lotNumber: string;
  expiryDate: string;
  quantity: number;
  unit: PackageUnit;
  slotId: string;
  receivedDate: string;
}

export interface BreakageLog {
  id: string;
  item: string;
  qty: number;
  cost: number;
  user: string;
  date: string;
}

export interface License {
  key: string;
  clientId: string;
  expiryDate: string;
  machineId: string | null; // Lié à une machine une fois activé
  durationDays: number;
  status: 'Active' | 'Expired' | 'Pending';
}

export interface WarehouseConfig {
  ifu: string;
  companyName: string;
  supervisor: string;
  licenseKey?: string;
  expiryDate?: string; 
  isActive: boolean;
  machineId: string; // L'identifiant unique de cet ordinateur
}

export interface Slot {
  id: string;
  zone: ZoneType;
  row: string;
  level: number;
  maxCapacity: number;
  currentLoad: number;
}
