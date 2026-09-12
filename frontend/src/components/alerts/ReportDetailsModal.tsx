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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white border border-slate-200 shadow-2xl">
        
        {/* Header */}
        <div className={`p-6 border-b border-slate-200 ${
          isCatastrophic
            ? 'bg-red-50 border-b-red-300'
            : isSevere
            ? 'bg-red-50/60 border-b-red-200'
            : isModerate
            ? 'bg-amber-50/60 border-b-amber-200'
            : 'bg-slate-50 border-b-slate-200'
        }`}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-3 py-1 rounded-lg text-sm font-bold whitespace-nowrap ${
                  isCatastrophic
                    ? 'bg-red-600 text-white border border-red-500/50'
                    : isSevere
                    ? 'bg-red-500 text-white border border-red-400'
                    : isModerate
                    ? 'bg-amber-500 text-white border border-amber-400'
                    : 'bg-slate-300 text-slate-900 border border-slate-400'
                }`}>
                  {report.severity}
                </span>
                <span className={`px-3 py-1 rounded-lg text-sm font-bold whitespace-nowrap ${
                  isVerified
                    ? 'bg-emerald-100 text-emerald-700 border border-emerald-300 flex items-center gap-1'
                    : 'bg-amber-100 text-amber-700 border border-amber-300 flex items-center gap-1'
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
              <h2 className="text-2xl font-bold text-slate-900">{report.locationDescription}</h2>
              <p className="text-sm text-slate-600 mt-1">Report ID: {report.id}</p>
            </div>
            <button
              onClick={onClose}
              className="flex-shrink-0 p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-600 hover:text-slate-900"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          
          {/* Thumbnail Image or Placeholder */}
          <div className="rounded-xl overflow-hidden border border-slate-300 bg-slate-100 shadow-sm">
            {imageLoaded ? (
              <img
                src={`/report-photo-${report.id}.jpg`}
                alt="Report"
                className="w-full max-h-96 object-cover"
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageLoaded(false)}
              />
            ) : (
              <div className="w-full h-64 bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl mb-2">📸</div>
                  <p className="text-slate-700">Photo for Report #{report.id}</p>
                  <p className="text-xs text-slate-600 mt-1">Upload: report-photo-{report.id}.jpg</p>
                </div>
              </div>
            )}
          </div>

          {/* Location & GPS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 shadow-sm">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-5 h-5 text-emerald-600" />
                <span className="text-sm font-bold text-slate-900">Location Coordinates</span>
              </div>
              <div className="text-sm text-slate-700 space-y-1">
                <p><strong className="text-slate-900">Latitude:</strong> {report.latitude.toFixed(4)}°N</p>
                <p><strong className="text-slate-900">Longitude:</strong> {report.longitude.toFixed(4)}°E</p>
                <p><strong className="text-slate-900">District:</strong> {report.districtId}</p>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-bold text-slate-900">Report Timing</span>
              </div>
              <div className="text-sm text-slate-700 space-y-1">
                <p><strong className="text-slate-900">Reported:</strong> {new Date(report.timestamp).toLocaleString('en-IN')}</p>
                <p><strong className="text-slate-900">ID:</strong> <span className="font-mono text-[12px]">{report.offlineSyncId}</span></p>
              </div>
            </div>
          </div>

          {/* Incident Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              Incident Details
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 shadow-sm">
                <p className="text-xs font-bold text-slate-600 mb-2">Landslide Type</p>
                <p className="text-sm font-bold text-slate-900">{report.landslideType.replace(/_/g, ' ')}</p>
              </div>
              
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 shadow-sm">
                <p className="text-xs font-bold text-slate-600 mb-2">Road Status</p>
                <p className="text-sm font-bold">
                  {report.roadBlocked ? (
                    <span className="text-red-600 flex items-center gap-1">
                      <XCircle className="w-4 h-4" />
                      Road Completely Blocked
                    </span>
                  ) : (
                    <span className="text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      Road Passable
                    </span>
                  )}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 shadow-sm">
                <p className="text-xs font-bold text-slate-600 mb-2">Casualties</p>
                <p className="text-sm font-bold text-slate-900">{report.casualtiesReported || '0'} reported</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 shadow-sm">
                <p className="text-xs font-bold text-slate-600 mb-2">Verification Status</p>
                <p className="text-sm font-bold">
                  {isVerified ? (
                    <span className="text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      Verified
                    </span>
                  ) : (
                    <span className="text-amber-600 flex items-center gap-1">
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
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-600" />
              Observer Description
            </h3>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 shadow-sm">
              <p className="text-sm text-slate-700 leading-relaxed">
                {report.description || 'No description provided.'}
              </p>
            </div>
          </div>

          {/* Reporter Information */}
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <User className="w-5 h-5 text-emerald-600" />
              Reporter Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 shadow-sm">
                <p className="text-xs font-bold text-slate-600 mb-1">Reporter Name</p>
                <p className="text-sm font-bold text-slate-900">{report.reporterName || 'Anonymous'}</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 shadow-sm">
                <p className="text-xs font-bold text-slate-600 mb-1 flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  Contact Number
                </p>
                <p className="text-sm font-bold text-slate-900">{report.reporterPhone || 'Not provided'}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-slate-200">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-900 font-semibold transition-colors shadow-sm"
            >
              Close
            </button>
            <button
              className="flex-1 px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-colors shadow-sm"
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
