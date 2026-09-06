import React from 'react';
import { Layers, ShieldAlert, AlertTriangle, AlertOctagon, CheckCircle2, Home, AlertCircle } from 'lucide-react';

export const MapLegend: React.FC = () => {
  return (
    <div className="p-3 rounded-lg bg-white border border-slate-300 shadow-lg text-xs space-y-2.5">
      <div className="flex items-center gap-2 pb-2 border-b border-slate-300 text-slate-900 font-bold text-xs">
        <Layers className="w-4 h-4 text-emerald-600" />
        <span className="text-[11px]">GIS Legend</span>
      </div>

      {/* Hazard Heatmap Colors */}
      <div className="space-y-1.5">
        <p className="text-[10px] uppercase font-bold text-slate-700">Hazard Severity</p>
        <div className="grid grid-cols-2 gap-2 text-[10px]">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-600 ring-1 ring-red-400 flex-shrink-0"></span>
            <span className="text-red-700 font-medium">Very High</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-500 flex-shrink-0"></span>
            <span className="text-amber-700 font-medium">High</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-yellow-400 flex-shrink-0"></span>
            <span className="text-yellow-700 font-medium">Moderate</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 flex-shrink-0"></span>
            <span className="text-emerald-700 font-medium">Low</span>
          </div>
        </div>
      </div>

      {/* Road Connectivity */}
      <div className="space-y-1.5 pt-2 border-t border-slate-300">
        <p className="text-[10px] uppercase font-bold text-slate-700">Road Status</p>
        <div className="space-y-1 text-[10px]">
          <div className="flex items-center gap-2">
            <span className="w-3 h-1 rounded-full bg-emerald-500 flex-shrink-0"></span>
            <span className="text-slate-700 font-medium">Passable</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-1 rounded-full bg-amber-500 flex-shrink-0"></span>
            <span className="text-slate-700 font-medium">Caution</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-1 rounded-full bg-red-600 flex-shrink-0"></span>
            <span className="text-red-700 font-bold">Blocked</span>
          </div>
        </div>
      </div>

      {/* Markers - Compact */}
      <div className="space-y-1 pt-2 border-t border-slate-300 text-[10px]">
        <div className="flex items-center gap-2">
          <Home className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
          <span className="text-slate-700 font-medium">Shelter</span>
        </div>
        <div className="flex items-center gap-2">
          <AlertCircle className="w-3.5 h-3.5 text-orange-600 flex-shrink-0" />
          <span className="text-slate-700 font-medium">Incident</span>
        </div>
      </div>
    </div>
  );
};
