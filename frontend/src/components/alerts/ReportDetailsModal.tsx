import React from 'react';
import { LandslideReport } from '../../types';
import { X, MapPin, AlertTriangle, Clock, User, Phone, Zap, CheckCircle2, XCircle, Camera } from 'lucide-react';

interface ReportDetailsModalProps {
  report: LandslideReport | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ReportDetailsModal: React.FC<ReportDetailsModalProps> = ({ report, isOpen, onClose }) => {
  const [imageLoaded, setImageLoaded] = React.useState(true);

  if (!isOpen || !report) return null;

  const isCatastrophic = report.severity === 'CATASTROPHIC';
  const isSevere = report.severity === 'SEVERE';
  const isModerate = report.severity === 'MODERATE';
  const isVerified = report.status === 'VERIFIED';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl">
        
        {/* Header */}
        <div className={`p-6 border-b border-slate-800 ${
          isCatastrophic
            ? 'bg-red-950/40 border-b-red-500/30'
            : isSevere
            ? 'bg-red-950/20 border-b-red-500/20'
            : isModerate
            ? 'bg-amber-950/20 border-b-amber-500/20'
            : 'bg-slate-800/40 border-b-slate-700/20'
        }`}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-3 py-1 rounded-lg text-sm font-bold whitespace-nowrap ${
                  isCatastrophic
                    ? 'bg-red-600 text-white border border-red-500/50'
                    : isSevere
                    ? 'bg-red-500/30 text-red-300 border border-red-500/40'
                    : isModerate
                    ? 'bg-amber-500/30 text-amber-300 border border-amber-500/40'
                    : 'bg-slate-700/60 text-slate-300 border border-slate-600'
                }`}>
                  {report.severity}
                </span>
                <span className={`px-3 py-1 rounded-lg text-sm font-bold whitespace-nowrap ${
                  isVerified
                    ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 flex items-center gap-1'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1'
                }`}>
                  {isVerified ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      VERIFIED
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-4 h-4" />
                      PENDING
                    </>
                  )}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-white">{report.locationDescription}</h2>
              <p className="text-sm text-slate-400 mt-1">Report ID: {report.id}</p>
            </div>
            <button
              onClick={onClose}
              className="flex-shrink-0 p-2 rounded-lg hover:bg-slate-800 transition-colors text-slate-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          
          {/* Thumbnail Image or Placeholder */}
          <div className="rounded-xl overflow-hidden border border-slate-700 bg-slate-800">
            {imageLoaded ? (
              <img
                src={`/report-photo-${report.id}.jpg`}
                alt="Report"
                className="w-full max-h-96 object-cover"
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageLoaded(false)}
              />
            ) : (
              <div className="w-full h-64 bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl mb-2">📸</div>
                  <p className="text-slate-400">Photo for Report #{report.id}</p>
                  <p className="text-xs text-slate-500 mt-1">Upload: report-photo-{report.id}.jpg</p>
                </div>
              </div>
            )}
          </div>

          {/* Location & GPS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-5 h-5 text-emerald-400" />
                <span className="text-sm font-bold text-slate-300">Location Coordinates</span>
              </div>
              <div className="text-sm text-slate-400 space-y-1">
                <p><strong className="text-slate-300">Latitude:</strong> {report.latitude.toFixed(4)}°N</p>
                <p><strong className="text-slate-300">Longitude:</strong> {report.longitude.toFixed(4)}°E</p>
                <p><strong className="text-slate-300">District:</strong> {report.districtId}</p>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-blue-400" />
                <span className="text-sm font-bold text-slate-300">Report Timing</span>
              </div>
              <div className="text-sm text-slate-400 space-y-1">
                <p><strong className="text-slate-300">Reported:</strong> {new Date(report.timestamp).toLocaleString('en-IN')}</p>
                <p><strong className="text-slate-300">ID:</strong> <span className="font-mono text-[12px]">{report.offlineSyncId}</span></p>
              </div>
            </div>
          </div>

          {/* Incident Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              Incident Details
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                <p className="text-xs font-bold text-slate-400 mb-2">Landslide Type</p>
                <p className="text-sm font-bold text-white">{report.landslideType.replace(/_/g, ' ')}</p>
              </div>
              
              <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                <p className="text-xs font-bold text-slate-400 mb-2">Road Status</p>
                <p className="text-sm font-bold">
                  {report.roadBlocked ? (
                    <span className="text-red-400 flex items-center gap-1">
                      <XCircle className="w-4 h-4" />
                      Road Completely Blocked
                    </span>
                  ) : (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      Road Passable
                    </span>
                  )}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                <p className="text-xs font-bold text-slate-400 mb-2">Casualties</p>
                <p className="text-sm font-bold text-white">{report.casualtiesReported || '0'} reported</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                <p className="text-xs font-bold text-slate-400 mb-2">Verification Status</p>
                <p className="text-sm font-bold">
                  {isVerified ? (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      Verified
                    </span>
                  ) : (
                    <span className="text-amber-400 flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4" />
                      Pending Verification
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              Observer Description
            </h3>
            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
              <p className="text-sm text-slate-300 leading-relaxed">
                {report.description || 'No description provided.'}
              </p>
            </div>
          </div>

          {/* Reporter Information */}
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <User className="w-5 h-5 text-emerald-400" />
              Reporter Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                <p className="text-xs font-bold text-slate-400 mb-1">Reporter Name</p>
                <p className="text-sm font-bold text-white">{report.reporterName || 'Anonymous'}</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                <p className="text-xs font-bold text-slate-400 mb-1 flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  Contact Number
                </p>
                <p className="text-sm font-bold text-white">{report.reporterPhone || 'Not provided'}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-slate-800">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-colors"
            >
              Close
            </button>
            <button
              className="flex-1 px-4 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold transition-colors"
              onClick={() => {
                const mapsUrl = `https://www.google.com/maps?q=${report.latitude},${report.longitude}`;
                window.open(mapsUrl, '_blank');
              }}
            >
              📍 View on Google Maps
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
