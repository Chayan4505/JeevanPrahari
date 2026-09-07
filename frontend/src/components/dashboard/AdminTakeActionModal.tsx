import React, { useState } from 'react';
import { LandslideReport, PriorityVillageItem } from '../../types';
import { X, MapPin, AlertTriangle, CheckCircle2, XCircle, Send, Radio, ShieldAlert, Phone, User, Home, Users } from 'lucide-react';
import { api } from '../../services/api';

interface AdminTakeActionModalProps {
  report?: LandslideReport | null;
  village?: PriorityVillageItem | null;
  isOpen: boolean;
  onClose: () => void;
  onBroadcastSmsAlert: (targetInfo: { districtId: string; areaName: string; defaultHeadline: string; defaultBody: string }) => void;
  onReportStatusUpdated?: () => void;
}

export const AdminTakeActionModal: React.FC<AdminTakeActionModalProps> = ({
  report,
  village,
  isOpen,
  onClose,
  onBroadcastSmsAlert,
  onReportStatusUpdated,
}) => {
  const [updating, setUpdating] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  if (!isOpen || (!report && !village)) return null;

  const isReport = !!report;
  const locationTitle = isReport ? report.locationDescription : village?.name;
  const districtId = isReport ? report.districtId : village?.districtId || 'IN-ML-EKH';
  const severity = isReport ? report.severity : (village?.riskLevel === 'VERY_HIGH' ? 'CATASTROPHIC' : 'SEVERE');
  const isVerified = isReport ? report.status === 'VERIFIED' : true;

  const handleVerifyStatus = async (newStatus: 'VERIFIED' | 'REJECTED' | 'RESOLVED') => {
    if (!report) return;
    setUpdating(true);
    try {
      await api.reports.verify(report.id, newStatus, 'Verified via District Admin Command Center');
      setStatusMessage(`Report status updated to ${newStatus}`);
      if (onReportStatusUpdated) onReportStatusUpdated();
      setTimeout(() => {
        setStatusMessage(null);
      }, 2000);
    } catch (e: any) {
      alert('Failed to update report status: ' + e.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleTriggerBroadcast = () => {
    const areaName = locationTitle || 'District Target Area';
    const headline = `CRITICAL ALERT: Landslide Hazard Warning for ${areaName}`;
    const body = isReport
      ? `${report.landslideType.replace('_', ' ')} reported at ${locationTitle}. ${report.description}`
      : `High risk slope instability detected at ${village?.name}. Vulnerability score: ${village?.vulnerabilityIndex}. Follow evacuation plan to ${village?.nearestShelterName}.`;

    onClose();
    onBroadcastSmsAlert({
      districtId,
      areaName,
      defaultHeadline: headline,
      defaultBody: body,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white border border-slate-300 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative text-slate-900 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-red-100 text-red-700 border border-red-200">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`px-2.5 py-0.5 rounded text-xs font-bold text-white ${
                  severity === 'CATASTROPHIC' || severity === 'SEVERE' ? 'bg-red-700' : 'bg-amber-600'
                }`}>
                  {severity}
                </span>
                {isReport && (
                  <span className={`px-2.5 py-0.5 rounded text-xs font-bold ${
                    isVerified ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-amber-100 text-amber-800 border border-amber-300'
                  }`}>
                    {report.status}
                  </span>
                )}
                <span className="text-xs text-slate-500 font-mono">District: {districtId}</span>
              </div>
              <h3 className="text-xl font-extrabold text-gov-navy-900">{locationTitle}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {statusMessage && (
          <div className="mt-4 p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 font-semibold text-xs rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* Modal Body */}
        <div className="py-5 space-y-5 text-xs">
          
          {/* Report Image or Settlement Profile */}
          {isReport ? (
            <div className="w-full h-56 rounded-xl overflow-hidden border border-slate-300 bg-slate-100 relative shadow-inner">
              <img
                src={report.mediaUrl || `/report-photo-${report.id}.jpg`}
                alt="Report Incident Site"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/high-risk-zone-1.jpg';
                }}
              />
              <div className="absolute bottom-2 left-2 bg-black/75 backdrop-blur-md px-3 py-1 rounded-lg text-white font-mono text-[11px] border border-white/20">
                Geo-Coordinates: {report.latitude.toFixed(4)}°N, {report.longitude.toFixed(4)}°E
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-sky-50 border border-sky-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sky-900 text-sm">Settlement Evacuation & Shelter Profile</span>
                <span className="font-mono text-xs font-bold text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-300">
                  Priority Score: {village?.priorityScore.toLocaleString()}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-slate-700">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-slate-500" />
                  <span><strong>Population:</strong> {village?.population.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Home className="w-4 h-4 text-blue-600" />
                  <span><strong>Nearest Shelter:</strong> {village?.nearestShelterName} ({village?.nearestShelterDistKm} km)</span>
                </div>
              </div>
              {village?.evacuationRoute && (
                <p className="text-slate-800 font-medium pt-1 border-t border-sky-200">
                  <strong>Evacuation Route:</strong> {village.evacuationRoute}
                </p>
              )}
            </div>
          )}

          {/* Description & Hazard Details */}
          <div className="space-y-2 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <h4 className="font-bold text-gov-navy-900 text-xs uppercase tracking-wider">Hazard Description & Impact</h4>
            <p className="text-slate-700 text-xs leading-relaxed">
              {isReport ? report.description : `High slope instability zone with heavy pore pressure saturation. Settlement prioritized for immediate targeted warning alert dispatch.`}
            </p>
            {isReport && (
              <div className="flex items-center gap-4 pt-2 border-t border-slate-200 text-[11px] text-slate-600">
                <span><strong>Reporter:</strong> {report.reporterName} ({report.reporterRole})</span>
                <span><strong>Road Blocked:</strong> {report.roadBlocked ? 'YES (Critical)' : 'NO (Passable)'}</span>
              </div>
            )}
          </div>

          {/* Verification Action Buttons for Reports */}
          {isReport && (
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-100 border border-slate-200">
              <span className="font-bold text-slate-700 text-xs">Verify / Update Status:</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleVerifyStatus('VERIFIED')}
                  disabled={updating}
                  className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1 transition-colors disabled:opacity-50"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verify</span>
                </button>
                <button
                  onClick={() => handleVerifyStatus('RESOLVED')}
                  disabled={updating}
                  className="px-3 py-1.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs transition-colors disabled:opacity-50"
                >
                  Resolve
                </button>
                <button
                  onClick={() => handleVerifyStatus('REJECTED')}
                  disabled={updating}
                  className="px-3 py-1.5 rounded-lg bg-slate-300 hover:bg-slate-400 text-slate-800 font-bold text-xs transition-colors disabled:opacity-50"
                >
                  Reject
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer with Primary SMS / CAP Alert Broadcast Button */}
        <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition-colors"
          >
            Close
          </button>
          
          <button
            onClick={handleTriggerBroadcast}
            className="px-6 py-2.5 rounded-xl bg-red-700 hover:bg-red-800 text-white font-extrabold text-xs flex items-center gap-2 shadow-md hover:shadow-lg transition-all border border-red-800"
          >
            <Radio className="w-4 h-4 animate-pulse" />
            <span>Broadcast SMS & CAP Alert</span>
          </button>
        </div>

      </div>
    </div>
  );
};
