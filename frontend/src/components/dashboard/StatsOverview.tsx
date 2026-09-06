import React from 'react';
import { OverviewStats } from '../../types';
import { ShieldAlert, AlertTriangle, CloudRain, Truck, FileText, BellRing, PhoneCall } from 'lucide-react';

interface StatsOverviewProps {
  stats: OverviewStats | null;
  onDispatchAlertClick?: () => void;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ stats, onDispatchAlertClick }) => {
  if (!stats) return null;

  const isCritical = stats.currentRiskLevel === 'VERY_HIGH' || stats.triggerStatus === 'ALERT';

  return (
    <div className="space-y-4">
      {/* Top Banner: District Status & Trigger State */}
      <div className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl ${
        isCritical
          ? 'bg-gradient-to-r from-red-950/80 via-slate-900 to-red-950/40 border-red-500/50'
          : 'bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-900 border-slate-800'
      }`}>
        <div className="flex items-center gap-3.5">
          <div className={`p-3 rounded-xl border ${
            isCritical ? 'bg-red-500/20 border-red-500/40 text-red-400 animate-pulse' : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
          }`}>
            <ShieldAlert className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-heading text-xl sm:text-2xl font-bold text-white tracking-tight">
                {stats.districtName}
              </h2>
              <span className="text-xs text-slate-400 font-medium px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
                {stats.state}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Landslide Hazard Level: <span className="font-bold text-red-400">{stats.currentRiskLevel}</span> • Dynamic Trigger: <span className="font-bold text-amber-400">{stats.triggerStatus}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {onDispatchAlertClick && (
            <button
              onClick={onDispatchAlertClick}
              className="flex-1 md:flex-initial px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 transition-all border border-red-400/30"
            >
              <BellRing className="w-4 h-4 animate-bounce" />
              <span>Broadcast NDMA Alert</span>
            </button>
          )}
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Rainfall Telemetry */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-medium">24h Rainfall</span>
            <CloudRain className="w-4 h-4 text-blue-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-white font-heading">{stats.rainfall24hMm.toFixed(1)}</span>
            <span className="text-xs text-slate-400">mm</span>
          </div>
          <p className="text-[11px] text-slate-400">
            3-Day: <span className="text-slate-200 font-semibold">{stats.rainfall3dMm.toFixed(0)}mm</span> • 7-Day: <span className="text-slate-200 font-semibold">{stats.rainfall7dMm.toFixed(0)}mm</span>
          </p>
        </div>

        {/* High Risk Settlements */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-medium">Critical Settlements</span>
            <AlertTriangle className="w-4 h-4 text-red-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-red-400 font-heading">{stats.highRiskVillagesCount}</span>
            <span className="text-xs text-slate-400">villages</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Pore pressure saturation elevated
          </p>
        </div>

        {/* Blocked Arterial Roads */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-medium">Highway Disruptions</span>
            <Truck className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-amber-400 font-heading">{stats.blockedRoadsCount}</span>
            <span className="text-xs text-slate-400">segments</span>
          </div>
          <p className="text-[11px] text-slate-400">
            NH-6 / NH-27 cut slopes active
          </p>
        </div>

        {/* Pending Reports & Active Alerts */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-medium">Citizen Reports</span>
            <FileText className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-emerald-400 font-heading">{stats.pendingIncidentReportsCount}</span>
            <span className="text-xs text-slate-400">pending review</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Active CAP Broadcasts: <span className="text-white font-semibold">{stats.activeAlertsCount}</span>
          </p>
        </div>

      </div>
    </div>
  );
};
