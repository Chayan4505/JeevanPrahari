import React, { useState } from 'react';
import { Alert } from '../../types';
import { Bell, Code, Share2, ShieldAlert, CheckCircle2, Clock, MapPin, Radio } from 'lucide-react';
import { CAPViewerModal } from '../alerts/CAPViewerModal';

interface LiveAlertFeedProps {
  alerts: Alert[];
}

export const LiveAlertFeed: React.FC<LiveAlertFeedProps> = ({ alerts }) => {
  const [selectedCapAlert, setSelectedCapAlert] = useState<Alert | null>(null);

  if (alerts.length === 0) {
    return (
      <div className="p-6 rounded-xl bg-white border border-slate-300 text-center space-y-2 shadow-sm">
        <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
        <h4 className="font-heading font-bold text-gov-navy-900 text-sm">No Active Critical Alerts</h4>
        <p className="text-xs text-slate-600">All North Eastern district slope sectors within baseline tolerances.</p>
      </div>
    );
  }

  return (
    <>
      <div className="p-4 sm:p-6 rounded-xl bg-white border border-slate-300 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-300 pb-3">
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-red-600 animate-pulse" />
            <h3 className="text-lg font-bold text-gov-navy-900">
              Live NDMA / CAP Alert Broadcasts
            </h3>
          </div>
          <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 font-bold border border-red-200">
            {alerts.length} Active
          </span>
        </div>

        <div className="space-y-3">
          {alerts.map((alert) => {
            const isExtreme = alert.severity === 'Extreme' || alert.severity === 'Severe';
            return (
              <div
                key={alert.id}
                className={`p-4 rounded-xl border transition-all ${
                  isExtreme
                    ? 'bg-red-50/60 border-red-300 hover:border-red-500'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold text-white uppercase tracking-wider ${
                      isExtreme ? 'bg-red-700' : 'bg-amber-600'
                    }`}>
                      {alert.severity} • {alert.urgency}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-600 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      {alert.affectedAreaName || alert.districtId}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[10px] text-slate-500">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(alert.sentAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} IST</span>
                  </div>
                </div>

                <h4 className="font-bold text-gov-navy-900 text-sm leading-snug mb-1">
                  {alert.headline}
                </h4>
                <p className="text-xs text-slate-700 line-clamp-2 mb-2 leading-relaxed">
                  {alert.description}
                </p>

                {alert.instruction && (
                  <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-medium mb-3">
                    <span className="font-bold text-emerald-950">Public Advisory:</span> {alert.instruction}
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-[11px]">
                  <div className="flex items-center gap-2 text-slate-600">
                    <span>Channels: <strong className="text-slate-900">{alert.dispatchedChannels}</strong></span>
                    <span>• Recip: <strong className="text-emerald-700 font-bold">{alert.recipientsCount}</strong></span>
                  </div>

                  <button
                    onClick={() => setSelectedCapAlert(alert)}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white hover:bg-slate-50 text-slate-800 font-semibold text-[11px] border border-slate-300 transition-colors shadow-sm"
                  >
                    <Code className="w-3.5 h-3.5 text-emerald-700" />
                    <span>View CAP XML</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CAP Viewer Modal */}
      {selectedCapAlert && (
        <CAPViewerModal
          alert={selectedCapAlert}
          isOpen={!!selectedCapAlert}
          onClose={() => setSelectedCapAlert(null)}
        />
      )}
    </>
  );
};
