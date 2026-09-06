import React, { useState } from 'react';
import { Alert } from '../../types';
import { X, AlertTriangle, MapPin, Clock, Users, Zap, Shield, FileText, ExternalLink } from 'lucide-react';

interface CAPViewerModalProps {
  alert: Alert;
  isOpen: boolean;
  onClose: () => void;
}

export const CAPViewerModal: React.FC<CAPViewerModalProps> = ({ alert, isOpen, onClose }) => {
  const [showXmlDetails, setShowXmlDetails] = useState(false);

  if (!isOpen) return null;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Extreme': return 'from-red-600 to-red-700';
      case 'Severe': return 'from-orange-600 to-orange-700';
      case 'Moderate': return 'from-amber-600 to-amber-700';
      default: return 'from-yellow-600 to-yellow-700';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-fade-in">
      {/* Outer Card: Set overflow-hidden and rounded-2xl to clip header gradients properly */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-700/80 rounded-2xl max-w-3xl w-full shadow-2xl max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Fixed Header with Severity Gradient */}
        <div className={`bg-gradient-to-r ${getSeverityColor(alert.severity)} px-6 py-6 relative overflow-hidden flex-shrink-0`}>
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
          <div className="relative z-10 flex items-start justify-between gap-4">
            <div className="flex-grow space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-white/20 rounded-xl text-white border border-white/30 backdrop-blur-sm">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <span className="px-3 py-1.5 rounded-lg bg-white/25 text-white font-bold text-sm backdrop-blur-sm border border-white/30">
                  {alert.severity} • {alert.urgency}
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white leading-snug">
                  {alert.headline}
                </h2>
                {alert.description && (
                  <p className="text-white/90 text-sm leading-relaxed mt-2 line-clamp-3">
                    {alert.description}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-white hover:bg-white/20 transition-colors flex-shrink-0"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Main Content */}
        <div className="p-6 space-y-6 text-white overflow-y-auto flex-grow">
          
          {/* Alert Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Affected Area */}
            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="p-1.5 bg-emerald-500/20 rounded-lg text-emerald-400">
                  <MapPin className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-white text-sm">Affected Area</h4>
              </div>
              <p className="text-slate-300 text-xs leading-relaxed">
                {alert.description || 'Geographic area and region details'}
              </p>
            </div>

            {/* Time Information */}
            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="p-1.5 bg-blue-500/20 rounded-lg text-blue-400">
                  <Clock className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-white text-sm">Timeline</h4>
              </div>
              <div className="space-y-1 text-xs text-slate-300">
                <p><span className="text-slate-400">Alert Sent:</span> {new Date(alert.sentAt).toLocaleString('en-IN')}</p>
                <p><span className="text-slate-400">Status:</span> {alert.status}</p>
                <p><span className="text-slate-400">Urgency:</span> {alert.urgency}</p>
              </div>
            </div>
          </div>

          {/* Action Required Section */}
          {alert.instruction && (
            <div className="p-5 rounded-xl bg-emerald-950/30 border border-emerald-500/40">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400 flex-shrink-0">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-emerald-300 text-sm mb-1">Action Required</h4>
                  <p className="text-emerald-200 text-xs leading-relaxed">
                    {alert.instruction}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Rescue Operations & Response */}
          <div className="p-5 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="p-1.5 bg-orange-500/20 rounded-lg text-orange-400">
                <Users className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-white text-base">Rescue & Response Operations</h4>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-3">
              <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-700/30">
                <p className="text-[10px] text-slate-400 mb-1">Response Status</p>
                <p className="font-bold text-orange-300 text-xs">Active</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-700/30">
                <p className="text-[10px] text-slate-400 mb-1">Units Deployed</p>
                <p className="font-bold text-blue-300 text-xs">12+</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-700/30">
                <p className="text-[10px] text-slate-400 mb-1">Coordinating Agency</p>
                <p className="font-bold text-emerald-300 text-xs">NDMA/SDRF</p>
              </div>
            </div>
            <p className="text-slate-300 text-xs leading-relaxed">
              Official rescue and mitigation operations are currently underway. Emergency response teams and SDRF units are coordinating with state authorities. For real-time updates, please follow official NDMA channels.
            </p>
          </div>

          {/* Evidence Section */}
          <div className="p-5 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="p-1.5 bg-purple-500/20 rounded-lg text-purple-400">
                <Shield className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-white text-base">Evidence & Documentation</h4>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {/* Field Photo 1 */}
              <div className="relative aspect-video rounded-lg bg-gradient-to-br from-slate-700 to-slate-900 border border-slate-700/50 overflow-hidden group">
                <img
                  src="/alert-field-photo-1.jpg"
                  alt="Field Photo 1"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              
              {/* Field Photo 2 */}
              <div className="relative aspect-video rounded-lg bg-gradient-to-br from-slate-700 to-slate-900 border border-slate-700/50 overflow-hidden group">
                <img
                  src="/alert-field-photo-2.jpg"
                  alt="Field Photo 2"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
            <p className="text-slate-400 text-[10px] mt-3">
              Official photographs and satellite imagery from affected zones are being documented by field teams and NDMA personnel.
            </p>
          </div>

          {/* Contacts & Resources */}
          <div className="p-5 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <h4 className="font-bold text-white text-sm mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Emergency Contacts & Resources
            </h4>
            <div className="space-y-2 text-xs">
              <p className="text-slate-300"><span className="text-slate-400">📞 Disaster Helpline:</span> 1977 or 112</p>
              <p className="text-slate-300"><span className="text-slate-400">📡 Official Source:</span> {alert.sender || 'NDMA-EarlyWarning@ner.gov.in'}</p>
              <p className="text-slate-300"><span className="text-slate-400">🆔 Alert ID:</span> <span className="font-mono text-[10px] text-emerald-400">{alert.identifier}</span></p>
            </div>
          </div>

          {/* Technical Details Toggle */}
          <button
            onClick={() => setShowXmlDetails(!showXmlDetails)}
            className="w-full p-3 rounded-xl border border-slate-700/50 text-slate-300 hover:text-white hover:border-slate-600/50 transition-colors flex items-center justify-between text-xs font-medium"
          >
            <span className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              {showXmlDetails ? 'Hide' : 'View'} Technical CAP XML Details
            </span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          {/* XML Details (Collapsible) */}
          {showXmlDetails && (
            <div className="rounded-xl bg-slate-950 p-3 border border-slate-800 overflow-x-auto">
              <pre className="font-mono text-[10px] text-emerald-300 whitespace-pre-wrap break-words leading-relaxed">
                {alert.capXml || 'CAP XML data not available'}
              </pre>
            </div>
          )}
        </div>

        {/* Fixed Footer */}
        <div className="p-4 border-t border-slate-800 flex items-center justify-between bg-slate-900/50 flex-shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>NDMA CAP v1.2 Compliant</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};