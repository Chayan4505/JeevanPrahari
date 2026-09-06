import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { 
  District, 
  OverviewStats, 
  PriorityVillageItem, 
  RoadSegment, 
  Alert 
} from '../types';
import { StatsOverview } from '../components/dashboard/StatsOverview';
import { EmergencyPriorityTable } from '../components/dashboard/EmergencyPriorityTable';
import { LiveAlertFeed } from '../components/dashboard/LiveAlertFeed';
import { DispatchAlertModal } from '../components/alerts/DispatchAlertModal';
import { 
  Sliders, 
  MapPin, 
  Truck, 
  AlertOctagon, 
  Radio, 
  CheckCircle2, 
  Compass, 
  RefreshCw 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const DistrictDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>(user?.districtId || 'IN-ML-EKH');
  const [districts, setDistricts] = useState<District[]>([]);
  const [stats, setStats] = useState<OverviewStats | null>(null);
  const [villages, setVillages] = useState<PriorityVillageItem[]>([]);
  const [roads, setRoads] = useState<RoadSegment[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const loadDashboardData = async (distId: string) => {
    setLoading(true);
    try {
      const [dList, oStats, vList, rList, aList] = await Promise.all([
        api.weather.getDistricts(),
        api.dashboard.getOverview(distId),
        api.dashboard.getPriorityVillages(distId),
        api.dashboard.getRoadConnectivity(distId),
        api.alerts.getActive(distId),
      ]);
      setDistricts(dList);
      setStats(oStats);
      setVillages(vList);
      setRoads(rList);
      setAlerts(aList);
    } catch (e) {
      console.warn('Dashboard data fetch notice:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData(selectedDistrictId);
  }, [selectedDistrictId]);

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Bar: District Command Center Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2.5">
            <Sliders className="w-7 h-7 text-emerald-400" />
            District Disaster Management Command Center
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time multi-hazard decision matrix, settlement evacuation ranking, and arterial road status.
          </p>
        </div>

        {/* District Switcher */}
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-emerald-400" />
          <select
            value={selectedDistrictId}
            onChange={(e) => setSelectedDistrictId(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs font-bold text-white focus:ring-1 focus:ring-emerald-500 cursor-pointer shadow-lg"
          >
            {districts.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} ({d.state})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats Overview */}
      <StatsOverview
        stats={stats}
        onDispatchAlertClick={() => setIsDispatchModalOpen(true)}
      />

      {/* Emergency Prioritization Ranking Table */}
      <EmergencyPriorityTable
        villages={villages}
        onDispatchNotice={(v) => setIsDispatchModalOpen(true)}
      />

      {/* 2-Column Section: Mountain Road Status & Live Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Mountain Highway Connectivity Matrix */}
        <div className="p-4 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-amber-400" />
              <h3 className="font-heading text-lg font-bold text-white">
                Mountain Arterial Roads Connectivity
              </h3>
            </div>
            <span className="text-xs text-slate-400">{roads.length} segments monitored</span>
          </div>

          <div className="space-y-3">
            {roads.map((road) => {
              let statusBadge = 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
              if (road.status === 'BLOCKED') statusBadge = 'bg-red-500/20 text-red-400 border-red-500/30 font-bold animate-pulse';
              else if (road.status === 'CRITICAL') statusBadge = 'bg-red-500/20 text-red-400 border-red-500/30 font-bold';
              else if (road.status === 'CAUTION') statusBadge = 'bg-amber-500/20 text-amber-400 border-amber-500/30 font-semibold';

              return (
                <div
                  key={road.id}
                  className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/70 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs">{road.roadNumber} - {road.segmentName}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase border ${statusBadge}`}>
                      {road.status}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400">
                    Length: <span className="text-slate-200">{road.lengthKm} km</span> • Criticality: <span className="text-emerald-400 font-bold">{road.criticalityIndex}/10</span>
                  </p>

                  {road.blockageCause && (
                    <p className="text-[11px] text-red-300 bg-red-950/30 p-2 rounded-lg border border-red-900/30">
                      <strong>Hazard:</strong> {road.blockageCause}
                    </p>
                  )}

                  {road.alternateRouteAdvisory && (
                    <p className="text-[11px] text-amber-300 bg-amber-950/30 p-2 rounded-lg border border-amber-900/30">
                      <strong>Advisory:</strong> {road.alternateRouteAdvisory}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Active Alert Broadcasts */}
        <LiveAlertFeed alerts={alerts} />

      </div>

      {/* Dispatch Alert Modal */}
      {isDispatchModalOpen && (
        <DispatchAlertModal
          isOpen={isDispatchModalOpen}
          onClose={() => setIsDispatchModalOpen(false)}
          onAlertDispatched={() => loadDashboardData(selectedDistrictId)}
          districts={districts}
          defaultDistrictId={selectedDistrictId}
        />
      )}

    </div>
  );
};
