import React, { useState } from 'react';
import { PriorityVillageItem } from '../../types';
import { ShieldAlert, ArrowUpDown, Navigation, Home, Users, AlertTriangle } from 'lucide-react';

interface EmergencyPriorityTableProps {
  villages: PriorityVillageItem[];
  onDispatchNotice?: (village: PriorityVillageItem) => void;
}

export const EmergencyPriorityTable: React.FC<EmergencyPriorityTableProps> = ({
  villages,
  onDispatchNotice,
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

  return (
    <div className="p-4 sm:p-6 rounded-md bg-white border border-slate-300 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-300 pb-3">
        <div>
          <h3 className="text-lg font-bold text-gov-navy-900 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            Emergency Response Prioritization Ranking
          </h3>
          <p className="text-xs text-slate-600">
            Decision Index: <span className="font-mono text-slate-900 font-semibold">Priority Score = Composite Risk × Population × Vulnerability</span>
          </p>
        </div>
        <span className="text-xs text-slate-600 font-medium">
          Showing {villages.length} vulnerable settlements
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-300 bg-slate-100">
              <th className="pb-3 px-3 font-semibold text-slate-900">Rank & Settlement</th>
              <th className="pb-3 px-3 font-semibold text-slate-900 cursor-pointer hover:text-gov-navy-900 transition-colors" onClick={() => toggleSort('compositeRiskScore')}>
                <div className="flex items-center gap-1">
                  <span>Hazard Risk</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="pb-3 px-3 font-semibold text-slate-900 cursor-pointer hover:text-gov-navy-900 transition-colors" onClick={() => toggleSort('population')}>
                <div className="flex items-center gap-1">
                  <span>Population</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="pb-3 px-3 font-semibold text-slate-900 cursor-pointer hover:text-gov-navy-900 transition-colors" onClick={() => toggleSort('priorityScore')}>
                <div className="flex items-center gap-1 text-gov-navy-900">
                  <span>Priority Score</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="pb-3 px-3 font-semibold text-slate-900">Nearest Shelter & Evacuation Route</th>
              <th className="pb-3 px-3 font-semibold text-slate-900 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-300">
            {sorted.map((v, idx) => {
              const isVHigh = v.riskLevel === 'VERY_HIGH';
              return (
                <tr key={v.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-3 pr-2">
                    <div className="flex items-center gap-2.5">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] text-white ${
                        idx === 0 ? 'bg-red-700' : (idx === 1 ? 'bg-amber-600' : 'bg-slate-400')
                      }`}>
                        {idx + 1}
                      </span>
                      <div>
                        <p className="font-bold text-slate-900 text-xs">{v.name}</p>
                        <p className="text-[10px] font-mono text-slate-600">{v.latitude.toFixed(4)}°N, {v.longitude.toFixed(4)}°E</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded-sm font-bold text-[11px] text-white ${
                      isVHigh ? 'bg-red-700' : 'bg-amber-600'
                    }`}>
                      {v.riskLevel} ({(v.compositeRiskScore * 100).toFixed(0)}%)
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-900 font-medium">
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3 text-slate-600" />
                      <span>{v.population.toLocaleString()}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-bold text-gov-navy-900 text-sm">
                      {v.priorityScore.toLocaleString()}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-900 max-w-xs">
                    <div className="space-y-0.5">
                      <p className="flex items-center gap-1 font-semibold text-slate-800">
                        <Home className="w-3 h-3 text-gov-navy-900 shrink-0" />
                        <span>{v.nearestShelterName} ({v.nearestShelterDistKm} km)</span>
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
                      onClick={() => onDispatchNotice && onDispatchNotice(v)}
                      className="px-2.5 py-1.5 rounded-md bg-gov-navy-900 hover:bg-gov-navy-700 text-white font-semibold text-[11px] border border-gov-navy-700 transition-colors"
                    >
                      Target Alert
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
