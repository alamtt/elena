
import React, { useState } from 'react';
import { MOCK_SLOTS } from '../constants';
import { ZoneType, StockItem } from '../types';
import { Thermometer, Box, Info } from 'lucide-react';

interface WarehouseMapProps {
  stock: StockItem[];
}

const WarehouseMap: React.FC<WarehouseMapProps> = ({ stock }) => {
  const [selectedSlot, setSelectedSlot] = useState<typeof MOCK_SLOTS[0] | null>(null);

  const getSlotLoad = (slotId: string) => {
    return stock
      .filter(item => item.slotId === slotId)
      .reduce((acc, curr) => acc + curr.quantity, 0);
  };

  const getZoneColor = (zone: ZoneType) => {
    switch(zone) {
      case ZoneType.AMBIENT: return 'bg-orange-50 border-orange-200';
      case ZoneType.REFRIGERATED: return 'bg-blue-50 border-blue-200';
      case ZoneType.COLD_STORAGE: return 'bg-indigo-50 border-indigo-300';
      default: return 'bg-slate-100 border-slate-200';
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <div className="flex-1 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {MOCK_SLOTS.map((slot) => {
            const load = getSlotLoad(slot.id);
            return (
              <button
                key={slot.id}
                onClick={() => setSelectedSlot(slot)}
                className={`p-4 border-2 rounded-xl transition-all duration-200 text-left relative overflow-hidden ${
                  selectedSlot?.id === slot.id ? 'ring-2 ring-blue-500 ring-offset-2' : ''
                } ${getZoneColor(slot.zone)}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold text-slate-500">{slot.id}</span>
                  <div className={`w-2 h-2 rounded-full ${load > 0 ? 'bg-blue-500 animate-pulse' : 'bg-slate-300'}`}></div>
                </div>
                <p className="text-sm font-bold text-slate-800">Rack {slot.row}-{slot.level}</p>
                <div className="mt-3 h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500" 
                    style={{ width: `${Math.min((load / slot.maxCapacity) * 100, 100)}%` }}
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold">{load} unités</p>
              </button>
            );
          })}
        </div>
        <div className="flex items-center space-x-6 p-4 bg-white rounded-xl border border-slate-100 shadow-sm text-sm">
          <div className="flex items-center space-x-2"><div className="w-3 h-3 rounded bg-orange-200"></div><span>Ambiante</span></div>
          <div className="flex items-center space-x-2"><div className="w-3 h-3 rounded bg-blue-200"></div><span>Réfrigérée</span></div>
          <div className="flex items-center space-x-2"><div className="w-3 h-3 rounded bg-indigo-300"></div><span>Froid</span></div>
        </div>
      </div>

      <div className="w-full lg:w-80">
        {selectedSlot ? (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-lg">
            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
              <Box size={20} className="mr-2 text-blue-600" /> Slot {selectedSlot.id}
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between py-2 border-b border-slate-50">
                <span className="text-slate-500">Zone</span>
                <span className="font-semibold">{selectedSlot.zone}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-50">
                <span className="text-slate-500">Occupation</span>
                <span className="font-semibold text-blue-600">{getSlotLoad(selectedSlot.id)} unités</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full bg-white border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-8 text-center text-slate-300">
            <Info size={32} className="mb-2 opacity-50" />
            <p className="text-sm font-medium">Sélectionnez un rack pour voir son contenu, Justin.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WarehouseMap;
