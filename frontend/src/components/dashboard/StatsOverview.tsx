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
      <div className={`p-4 sm:p-5 rounded-xl border transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm ${
        isCritical
          ? 'bg-red-50 border-red-300 border-l-4 border-l-red-700'
          : 'bg-emerald-50 border-emerald-300 border-l-4 border-l-emerald-700'
      }`}>
        <div className="flex items-center gap-3.5">
          <div className={`p-3 rounded-lg border ${
            isCritical ? 'bg-red-100 border-red-300 text-red-700' : 'bg-emerald-100 border-emerald-300 text-emerald-800'
          }`}>
            <ShieldAlert className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-heading text-xl sm:text-2xl font-bold text-gov-navy-900 tracking-tight">
                {stats.districtName}
              </h2>
              <span className="text-xs text-slate-700 font-semibold px-2 py-0.5 rounded bg-white border border-slate-300">
                {stats.state}
              </span>
            </div>
            <p className="text-xs text-slate-700 mt-0.5 font-medium">
              Landslide Hazard Level: <span className="font-bold text-red-700">{stats.currentRiskLevel}</span> • Dynamic Trigger: <span className="font-bold text-amber-700">{stats.triggerStatus}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {onDispatchAlertClick && (
            <button
              onClick={onDispatchAlertClick}
              className="flex-1 md:flex-initial px-5 py-2.5 rounded-lg bg-red-700 hover:bg-red-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all border border-red-800"
            >
              <BellRing className="w-4 h-4 animate-bounce" />
              <span>Broadcast NDMA CAP Alert</span>
            </button>
          )}
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Rainfall Telemetry */}
        <div className="p-4 rounded-xl bg-white border border-slate-300 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-600 text-xs font-semibold">
            <span>24h Rainfall</span>
            <CloudRain className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-gov-navy-900 font-heading">{stats.rainfall24hMm.toFixed(1)}</span>
            <span className="text-xs text-slate-600 font-medium">mm</span>
          </div>
          <p className="text-[11px] text-slate-600">
            3-Day: <span className="text-slate-900 font-bold">{stats.rainfall3dMm.toFixed(0)}mm</span> • 7-Day: <span className="text-slate-900 font-bold">{stats.rainfall7dMm.toFixed(0)}mm</span>
          </p>
        </div>

        {/* High Risk Settlements */}
        <div className="p-4 rounded-xl bg-white border border-slate-300 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-600 text-xs font-semibold">
            <span>Critical Settlements</span>
            <AlertTriangle className="w-4 h-4 text-red-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-red-700 font-heading">{stats.highRiskVillagesCount}</span>
            <span className="text-xs text-slate-600 font-medium">villages</span>
          </div>
          <p className="text-[11px] text-slate-600">
            Pore pressure saturation elevated
          </p>
        </div>

        {/* Blocked Arterial Roads */}
        <div className="p-4 rounded-xl bg-white border border-slate-300 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-600 text-xs font-semibold">
            <span>Highway Disruptions</span>
            <Truck className="w-4 h-4 text-amber-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-amber-700 font-heading">{stats.blockedRoadsCount}</span>
            <span className="text-xs text-slate-600 font-medium">segments</span>
          </div>
          <p className="text-[11px] text-slate-600">
            NH-6 / NH-27 cut slopes active
          </p>
        </div>

        {/* Pending Reports & Active Alerts */}
        <div className="p-4 rounded-xl bg-white border border-slate-300 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-600 text-xs font-semibold">
            <span>Citizen Reports</span>
            <FileText className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-emerald-800 font-heading">{stats.pendingIncidentReportsCount}</span>
            <span className="text-xs text-slate-600 font-medium">pending review</span>
          </div>
          <p className="text-[11px] text-slate-600">
            Active CAP Broadcasts: <span className="text-gov-navy-900 font-bold">{stats.activeAlertsCount}</span>
          </p>
        </div>

      </div>
    </div>
  );
};
