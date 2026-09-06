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
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 text-center space-y-2">
        <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
        <h4 className="font-heading font-bold text-white text-sm">No Active Critical Alerts</h4>
        <p className="text-xs text-slate-400">All North Eastern district slope sectors within baseline tolerances.</p>
      </div>
    );
  }

  return (
    <>
      <div className="p-4 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-red-500 animate-pulse" />
            <h3 className="font-heading text-lg font-bold text-white">
              Live NDMA / CAP Alert Broadcasts
            </h3>
          </div>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 font-bold border border-red-500/30">
            {alerts.length} Active
          </span>
        </div>

        <div className="space-y-3">
          {alerts.map((alert) => {
            const isExtreme = alert.severity === 'Extreme' || alert.severity === 'Severe';
            return (
              <div
                key={alert.id}
                className={`p-4 rounded-xl border transition-all ${isExtreme
                    ? 'bg-slate-900 border-red-500/40 hover:border-red-500 shadow-lg shadow-red-950/20'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${isExtreme ? 'bg-red-500 text-white' : 'bg-amber-500 text-slate-950'
                      }`}>
                      {alert.severity} • {alert.urgency}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      {alert.affectedAreaName || alert.districtId}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[10px] text-slate-400">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(alert.sentAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} IST</span>
                  </div>
                </div>

                <h4 className="font-bold text-white text-sm leading-snug mb-1">
                  {alert.headline}
                </h4>
                <p className="text-xs text-slate-300 line-clamp-2 mb-2 leading-relaxed">
                  {alert.description}
                </p>

                {alert.instruction && (
                  <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs text-emerald-300 font-medium mb-3">
                    <span className="font-bold text-slate-200">Public Advisory:</span> {alert.instruction}
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px]">
                  <div className="flex items-center gap-2 text-slate-400">
                    <span>Channels: <strong className="text-slate-200">{alert.dispatchedChannels}</strong></span>
                    <span>• Recip: <strong className="text-emerald-400">{alert.recipientsCount}</strong></span>
                  </div>

                  <button
                    onClick={() => setSelectedCapAlert(alert)}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-semibold text-[11px] border border-slate-700 transition-colors"
                  >
                    <Code className="w-3.5 h-3.5 text-emerald-400" />
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
