import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { 
  District, 
  OverviewStats, 
  PriorityVillageItem, 
  RoadSegment, 
  Alert,
  LandslideReport 
} from '../types';
import { StatsOverview } from '../components/dashboard/StatsOverview';
import { EmergencyPriorityTable } from '../components/dashboard/EmergencyPriorityTable';
import { LiveAlertFeed } from '../components/dashboard/LiveAlertFeed';
import { DispatchAlertModal } from '../components/alerts/DispatchAlertModal';
import { AdminTakeActionModal } from '../components/dashboard/AdminTakeActionModal';
import { 
  Sliders, 
  MapPin, 
  Truck, 
  AlertOctagon, 
  Radio, 
  CheckCircle2, 
  Compass, 
  RefreshCw,
  FileText,
  BellRing,
  Send
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
  const [reports, setReports] = useState<LandslideReport[]>([]);

  // Action Modals State
  const [selectedReportForAction, setSelectedReportForAction] = useState<LandslideReport | null>(null);
  const [selectedVillageForAction, setSelectedVillageForAction] = useState<PriorityVillageItem | null>(null);
  const [isAdminActionModalOpen, setIsAdminActionModalOpen] = useState<boolean>(false);
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState<boolean>(false);

  // Pre-filled Dispatch Modal Props
  const [dispatchPreFill, setDispatchPreFill] = useState<{
    districtId: string;
    areaName: string;
    headline: string;
    description: string;
  } | null>(null);

  const [loading, setLoading] = useState<boolean>(true);

  const loadDashboardData = async (distId: string) => {
    setLoading(true);
    try {
      const [dList, oStats, vList, rList, aList, repList] = await Promise.all([
        api.weather.getDistricts(),
        api.dashboard.getOverview(distId),
        api.dashboard.getPriorityVillages(distId),
        api.dashboard.getRoadConnectivity(distId),
        api.alerts.getActive(distId),
        api.reports.getAll(distId),
      ]);
      setDistricts(dList);
      setStats(oStats);
      setVillages(vList);
      setRoads(rList);
      setAlerts(aList);
      setReports(repList);
    } catch (e) {
      console.warn('Dashboard data fetch notice:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData(selectedDistrictId);
  }, [selectedDistrictId]);

  const handleOpenActionForReport = (report: LandslideReport) => {
    setSelectedReportForAction(report);
    setSelectedVillageForAction(null);
    setIsAdminActionModalOpen(true);
  };

  const handleOpenActionForVillage = (village: PriorityVillageItem) => {
    setSelectedVillageForAction(village);
    setSelectedReportForAction(null);
    setIsAdminActionModalOpen(true);
  };

  const handleTriggerBroadcastModal = (targetInfo: {
    districtId: string;
    areaName: string;
    defaultHeadline: string;
    defaultBody: string;
  }) => {
    setDispatchPreFill({
      districtId: targetInfo.districtId,
      areaName: targetInfo.areaName,
      headline: targetInfo.defaultHeadline,
      description: targetInfo.defaultBody,
    });
    setIsDispatchModalOpen(true);
  };

  return (
    <div className="w-full bg-slate-50 min-h-screen px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-slate-900">
      
      {/* Top Bar: District Command Center Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-300 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded bg-gov-saffron-100 border border-gov-saffron-300 text-gov-saffron-700 text-xs font-bold">
              NDMA & North Eastern Council Command Portal
            </span>
            <span className="px-2.5 py-0.5 rounded bg-sky-100 border border-sky-300 text-sky-800 text-xs font-semibold">
              Role: District Disaster Manager
            </span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-gov-navy-900 flex items-center gap-2.5">
            <Sliders className="w-7 h-7 text-gov-navy-900" />
            District Disaster Management Command Center
          </h1>
          <p className="text-xs text-slate-600 mt-1 font-medium">
            Real-time multi-hazard decision matrix, settlement evacuation ranking, and arterial road status.
          </p>
        </div>

        {/* District Switcher & Broadcast Button */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-white border border-slate-300 rounded-xl px-3 py-1.5 shadow-sm">
            <MapPin className="w-4 h-4 text-gov-navy-900" />
            <select
              value={selectedDistrictId}
              onChange={(e) => setSelectedDistrictId(e.target.value)}
              className="bg-transparent text-xs font-bold text-gov-navy-900 focus:outline-none cursor-pointer"
            >
              {districts.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.state})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => {
              setDispatchPreFill(null);
              setIsDispatchModalOpen(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-red-700 hover:bg-red-800 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all border border-red-800"
          >
            <BellRing className="w-4 h-4 animate-bounce" />
            <span>Broadcast NDMA CAP Alert</span>
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <StatsOverview
        stats={stats}
        onDispatchAlertClick={() => {
          setDispatchPreFill(null);
          setIsDispatchModalOpen(true);
        }}
      />

      {/* Emergency Prioritization Ranking Table */}
      <EmergencyPriorityTable
        villages={villages}
        onTakeAction={handleOpenActionForVillage}
        onDispatchNotice={handleOpenActionForVillage}
      />

      {/* Crowd-Sourced Field Reports Section (District Admin Action Matrix) */}
      <div className="p-4 sm:p-6 rounded-xl bg-white border border-slate-300 shadow-sm space-y-4">
        <div className="flex items-center justify-between gap-4 border-b border-slate-300 pb-3">
          <div className="flex items-center gap-2.5">
            <FileText className="w-5 h-5 text-gov-navy-900" />
            <div>
              <h3 className="text-lg font-bold text-gov-navy-900">
                District Crowd-Sourced Reports & Field Inspections
              </h3>
              <p className="text-xs text-slate-600">Review ground reports, verify severity, and dispatch targeted SMS warnings</p>
            </div>
          </div>
          <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-3 py-1 rounded border border-slate-300">
            {reports.length} Reports Logged
          </span>
        </div>

        {reports.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {reports.map((rep) => {
              const isVerified = rep.status === 'VERIFIED';
              const isCatastrophic = rep.severity === 'CATASTROPHIC' || rep.severity === 'SEVERE';

              return (
                <div
                  key={rep.id}
                  className="p-4 rounded-xl bg-white border border-slate-300 hover:border-gov-navy-900 transition-all flex flex-col justify-between space-y-3 shadow-sm group"
                >
                  {/* Card Badges */}
                  <div className="flex items-center justify-between gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold text-white ${
                      isCatastrophic ? 'bg-red-700' : 'bg-amber-600'
                    }`}>
                      {rep.severity}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      isVerified ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-amber-100 text-amber-800 border border-amber-300'
                    }`}>
                      {rep.status}
                    </span>
                  </div>

                  {/* Image Thumbnail */}
                  <div className="w-full h-36 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 relative">
                    <img
                      src={rep.mediaUrl || `/report-photo-${rep.id}.jpg`}
                      alt="Report Thumbnail"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/high-risk-zone-1.jpg';
                      }}
                    />
                  </div>

                  {/* Details */}
                  <div className="space-y-1">
                    <h4 className="font-bold text-xs text-gov-navy-900 line-clamp-2">{rep.locationDescription}</h4>
                    <p className="text-[11px] text-slate-600 line-clamp-2">{rep.description}</p>
                  </div>

                  {/* Action Button */}
                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between gap-2">
                    <span className="text-[10px] text-slate-500 font-medium truncate">By: {rep.reporterName}</span>
                    <button
                      onClick={() => handleOpenActionForReport(rep)}
                      className="px-3 py-1.5 rounded bg-red-700 hover:bg-red-800 text-white font-bold text-xs flex items-center gap-1 shadow-sm transition-colors"
                    >
                      <Send className="w-3 h-3" />
                      <span>Take Action</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200">
            <p className="text-sm font-semibold text-slate-700">No active reports registered for this district.</p>
          </div>
        )}
      </div>

      {/* 2-Column Section: Mountain Road Status & Live Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Mountain Highway Connectivity Matrix */}
        <div className="p-4 sm:p-6 rounded-xl bg-white border border-slate-300 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-300 pb-3">
            <div className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-amber-600" />
              <h3 className="text-lg font-bold text-gov-navy-900">
                Mountain Arterial Roads Connectivity
              </h3>
            </div>
            <span className="text-xs text-slate-600 font-semibold">{roads.length} segments monitored</span>
          </div>

          <div className="space-y-3">
            {roads.map((road) => {
              let statusBadge = 'bg-emerald-100 text-emerald-800 border-emerald-300';
              if (road.status === 'BLOCKED') statusBadge = 'bg-red-700 text-white font-bold animate-pulse';
              else if (road.status === 'CRITICAL') statusBadge = 'bg-red-600 text-white font-bold';
              else if (road.status === 'CAUTION') statusBadge = 'bg-amber-100 text-amber-900 border-amber-300 font-semibold';

              return (
                <div
                  key={road.id}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gov-navy-900 text-xs">{road.roadNumber} - {road.segmentName}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase border ${statusBadge}`}>
                      {road.status}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-600">
                    Length: <span className="text-slate-900 font-bold">{road.lengthKm} km</span> • Criticality: <span className="text-emerald-800 font-bold">{road.criticalityIndex}/10</span>
                  </p>

                  {road.blockageCause && (
                    <p className="text-[11px] text-red-800 bg-red-50 p-2 rounded-lg border border-red-200 font-medium">
                      <strong>Hazard:</strong> {road.blockageCause}
                    </p>
                  )}

                  {road.alternateRouteAdvisory && (
                    <p className="text-[11px] text-amber-900 bg-amber-50 p-2 rounded-lg border border-amber-200 font-medium">
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

      {/* Take Action Modal */}
      <AdminTakeActionModal
        report={selectedReportForAction}
        village={selectedVillageForAction}
        isOpen={isAdminActionModalOpen}
        onClose={() => setIsAdminActionModalOpen(false)}
        onBroadcastSmsAlert={handleTriggerBroadcastModal}
        onReportStatusUpdated={() => loadDashboardData(selectedDistrictId)}
      />

      {/* Dispatch Alert Modal */}
      {isDispatchModalOpen && (
        <DispatchAlertModal
          isOpen={isDispatchModalOpen}
          onClose={() => {
            setIsDispatchModalOpen(false);
            setDispatchPreFill(null);
          }}
          onAlertDispatched={() => loadDashboardData(selectedDistrictId)}
          districts={districts}
          defaultDistrictId={dispatchPreFill?.districtId || selectedDistrictId}
        />
      )}

    </div>
  );
};
