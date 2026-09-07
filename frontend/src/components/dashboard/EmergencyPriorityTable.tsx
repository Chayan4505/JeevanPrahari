import React, { useState } from 'react';
import { PriorityVillageItem } from '../../types';
import { ShieldAlert, ArrowUpDown, Navigation, Home, Users, AlertTriangle, Send } from 'lucide-react';

interface EmergencyPriorityTableProps {
  villages: PriorityVillageItem[];
  onDispatchNotice?: (village: PriorityVillageItem) => void;
  onTakeAction?: (village: PriorityVillageItem) => void;
}

export const EmergencyPriorityTable: React.FC<EmergencyPriorityTableProps> = ({
  villages,
  onDispatchNotice,
  onTakeAction,
}) => {
  const [sortField, setSortField] = useState<'priorityScore' | 'compositeRiskScore' | 'population'>('priorityScore');
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  const sorted = [...villages].sort((a, b) => {
    const valA = a[sortField];
    const valB = b[sortField];
    return sortAsc ? valA - valB : valB - valA;
  });

  const toggleSort = (field: 'priorityScore' | 'compositeRiskScore' | 'population') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const handleActionClick = (village: PriorityVillageItem) => {
    if (onTakeAction) {
      onTakeAction(village);
    } else if (onDispatchNotice) {
      onDispatchNotice(village);
    }
  };

  return (
    <div className="p-4 sm:p-6 rounded-xl bg-white border border-slate-300 shadow-sm space-y-4">
      
      {/* Table Header & Scientific Index Formula */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-300 pb-3">
        <div>
          <h3 className="text-lg font-bold text-gov-navy-900 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            Emergency Response Prioritization Ranking
          </h3>
          <p className="text-xs text-slate-600">
            Decision Index: <span className="font-mono text-gov-navy-900 font-bold">Priority Score = Composite Risk × Population × Vulnerability</span>
          </p>
        </div>
        <span className="text-xs text-slate-600 font-semibold bg-slate-100 px-3 py-1 rounded border border-slate-200">
          Showing {villages.length} vulnerable settlements
        </span>
      </div>

      {/* Prioritization Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-300 bg-slate-100 text-slate-800">
              <th className="py-2.5 px-3 font-bold">Rank & Settlement</th>
              <th className="py-2.5 px-3 font-bold cursor-pointer hover:text-gov-navy-900 transition-colors" onClick={() => toggleSort('compositeRiskScore')}>
                <div className="flex items-center gap-1">
                  <span>Hazard Risk</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th className="py-2.5 px-3 font-bold cursor-pointer hover:text-gov-navy-900 transition-colors" onClick={() => toggleSort('population')}>
                <div className="flex items-center gap-1">
                  <span>Population</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th className="py-2.5 px-3 font-bold cursor-pointer hover:text-gov-navy-900 transition-colors" onClick={() => toggleSort('priorityScore')}>
                <div className="flex items-center gap-1 text-emerald-800">
                  <span>Priority Score</span>
                  <ArrowUpDown className="w-3 h-3 text-emerald-700" />
                </div>
              </th>
              <th className="py-2.5 px-3 font-bold">Nearest Shelter & Evacuation Route</th>
              <th className="py-2.5 px-3 font-bold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {sorted.map((v, idx) => {
              const isVHigh = v.riskLevel === 'VERY_HIGH';
              return (
                <tr key={v.id} className="hover:bg-sky-50/50 transition-colors">
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2.5">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] text-white shrink-0 ${
                        idx === 0 ? 'bg-red-700 shadow-sm' : (idx === 1 ? 'bg-amber-600 shadow-sm' : 'bg-slate-500')
                      }`}>
                        {idx + 1}
                      </span>
                      <div>
                        <p className="font-bold text-slate-900 text-xs">{v.name}</p>
                        <p className="text-[10px] font-mono text-slate-500">{v.latitude.toFixed(4)}°N, {v.longitude.toFixed(4)}°E</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold text-white whitespace-nowrap ${
                      isVHigh ? 'bg-red-700' : 'bg-amber-600'
                    }`}>
                      {v.riskLevel} ({(v.compositeRiskScore * 100).toFixed(0)}%)
                    </span>
                  </td>
                  <td className="py-3 px-3 font-semibold text-slate-800">
                    <div className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-slate-500" />
                      <span>{v.population.toLocaleString()}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-heading font-extrabold text-emerald-800 text-sm">
                      {v.priorityScore.toLocaleString()}
                    </span>
                  </td>
                  <td className="py-3 px-3 max-w-xs">
                    <div className="space-y-0.5">
                      <p className="flex items-center gap-1 font-bold text-slate-800">
                        <Home className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                        <span className="truncate">{v.nearestShelterName} ({v.nearestShelterDistKm} km)</span>
                      </p>
                      {v.evacuationRoute && (
                        <p className="text-[11px] text-slate-600 truncate" title={v.evacuationRoute}>
                          Route: {v.evacuationRoute}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => handleActionClick(v)}
                      className="px-3 py-1.5 rounded-md bg-red-700 hover:bg-red-800 text-white font-bold text-xs flex items-center gap-1.5 ml-auto shadow-sm transition-colors"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Take Action</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
