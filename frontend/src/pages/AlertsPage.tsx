import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Alert, District, LandslideReport } from '../types';
import { Radio, Code, Clock, MapPin, CheckCircle2, ShieldAlert, Filter, FileText, AlertCircle } from 'lucide-react';
import { CAPViewerModal } from '../components/alerts/CAPViewerModal';
import { ReportDetailsModal } from '../components/alerts/ReportDetailsModal';
import { useAuth } from '../context/AuthContext';
import { DispatchAlertModal } from '../components/alerts/DispatchAlertModal';

export const AlertsPage: React.FC = () => {
  const { hasRole } = useAuth();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [recentReports, setRecentReports] = useState<LandslideReport[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState<string>('ALL');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');
  const [selectedCapAlert, setSelectedCapAlert] = useState<Alert | null>(null);
  const [selectedReport, setSelectedReport] = useState<LandslideReport | null>(null);
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [seeding, setSeeding] = useState<boolean>(false);

  const seedMoreReports = async () => {
    setSeeding(true);
    try {
      await api.admin.seedSampleReports();
      await loadData();
    } catch (e) {
      console.warn('Error seeding reports:', e);
    } finally {
      setSeeding(false);
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [aList, dList, rList] = await Promise.all([
        api.alerts.getActive(selectedDistrict !== 'ALL' ? selectedDistrict : undefined),
        api.weather.getDistricts(),
        api.reports.getAll(),
      ]);
      setAlerts(aList);
      setDistricts(dList);
      setRecentReports(rList);
    } catch (e) {
      console.warn('Error loading data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedDistrict]);

  const filteredAlerts = alerts.filter((a) => {
    if (selectedSeverity !== 'ALL' && a.severity !== selectedSeverity) return false;
    return true;
  });

  const isDistrictAdmin = hasRole(['ROLE_DISTRICT_ADMIN', 'ROLE_SUPER_ADMIN']);

  const getSeverityColors = (severity: string) => {
    switch (severity) {
      case 'Extreme':
      case 'Severe':
      case 'CATASTROPHIC':
      case 'SEVERE':
        return {
          bg: 'bg-red-50',
          border: 'border-red-300 border-l-4 border-l-red-700',
          text: 'text-red-900',
          badge: 'bg-red-700 text-white',
          headerText: 'text-red-800',
        };
      case 'Moderate':
      case 'MODERATE':
        return {
          bg: 'bg-orange-50',
          border: 'border-orange-300 border-l-4 border-l-orange-600',
          text: 'text-orange-900',
          badge: 'bg-orange-600 text-white',
          headerText: 'text-orange-800',
        };
      default:
        return {
          bg: 'bg-green-50',
          border: 'border-green-300 border-l-4 border-l-green-700',
          text: 'text-green-900',
          badge: 'bg-green-700 text-white',
          headerText: 'text-green-800',
        };
    }
  };

  return (
    <div className="min-h-screen pb-16 space-y-0">
      
      {/* NDMA CAP Alerts Section */}
      <div className="w-full bg-white border-b border-slate-300 py-12">
        <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Radio className="w-5 h-5 text-red-700 animate-pulse" />
                <span className="text-xs font-bold text-red-700 uppercase tracking-wider">Official Broadcasts</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gov-navy-900">
                NDMA CAP Alerts
              </h1>
              <p className="text-sm text-slate-600 mt-2 max-w-2xl">
                Real-time official early warnings conforming to OASIS Common Alerting Protocol (CAP v1.2) standard for India.
              </p>
            </div>

            {isDistrictAdmin && (
              <button
                onClick={() => setIsDispatchModalOpen(true)}
                className="px-4 py-2.5 rounded-md bg-red-700 hover:bg-red-800 text-white font-bold text-sm flex items-center gap-2 transition-all border border-red-600 shadow-sm hover:shadow-md whitespace-nowrap"
              >
                <Radio className="w-4 h-4" />
                <span>Broadcast Alert</span>
              </button>
            )}
          </div>

          {/* Filter Bar */}
          <div className="p-4 rounded-md bg-slate-50 border border-slate-300 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Filter className="w-4 h-4 text-gov-navy-900" />
              <span className="font-semibold text-slate-900 text-sm">Filter Alerts:</span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* District Filter */}
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 font-medium"
              >
                <option value="ALL">All NER Districts</option>
                {districts.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>

              {/* Severity Filter */}
              <select
                value={selectedSeverity}
                onChange={(e) => setSelectedSeverity(e.target.value)}
                className="bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 font-medium"
              >
                <option value="ALL">All Severities</option>
                <option value="Extreme">Extreme (Red)</option>
                <option value="Severe">Severe (Orange)</option>
                <option value="Moderate">Moderate (Yellow)</option>
                <option value="Minor">Minor (Advisory)</option>
              </select>
            </div>
          </div>

          {/* Alerts Grid */}
          <div className="grid grid-cols-1 gap-5">
            {filteredAlerts.length > 0 ? (
              filteredAlerts.map((alert) => {
                const colors = getSeverityColors(alert.severity);
                return (
                  <div
                    key={alert.id}
                    onClick={() => setSelectedCapAlert(alert)}
                    className={`p-6 rounded-md border transition-all space-y-4 group cursor-pointer hover:shadow-md ${colors.bg} ${colors.border}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-grow">
                        <div className="flex items-center gap-3 mb-3">
                          <span className={`px-3 py-1.5 rounded-sm text-xs font-bold uppercase tracking-wide ${colors.badge}`}>
                            {alert.severity} • {alert.urgency}
                          </span>
                        </div>
                        <h3 className={`font-bold text-lg leading-snug mb-2 ${colors.headerText}`}>
                          {alert.headline}
                        </h3>
                        <p className={`text-sm leading-relaxed line-clamp-3 ${colors.text}`}>
                          {alert.description}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span className={`text-xs font-medium flex items-center gap-1 whitespace-nowrap ${colors.text}`}>
                          <Clock className="w-4 h-4" />
                          {new Date(alert.sentAt).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    {alert.instruction && (
                      <div className="p-4 rounded-md bg-green-50 border border-green-300">
                        <span className="font-bold text-green-900">Action Required: </span>
                        <span className="text-green-900">{alert.instruction}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-3 border-t border-slate-300 text-xs">
                      <span className={`font-mono ${colors.text}`}>ID: {alert.identifier}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCapAlert(alert);
                        }}
                        className="px-3 py-2 rounded-md bg-white border border-slate-300 hover:bg-slate-50 text-slate-900 font-semibold text-xs flex items-center gap-2 transition-colors"
                      >
                        <Code className="w-4 h-4" />
                        <span>View CAP XML</span>
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full p-12 text-center rounded-md bg-slate-50 border border-slate-300">
                <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-base text-slate-600 font-medium">No active NDMA CAP alerts at this time</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Crowd-Sourced Field Reports Section */}
      <div className="w-full bg-slate-50 px-4 sm:px-6 lg:px-8 py-12 space-y-6">
        <div className="w-full max-w-[1800px] mx-auto">
          <div className="flex items-center justify-between gap-4 pb-6 border-b border-slate-300">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-gov-navy-900" />
              <div>
                <h2 className="text-2xl font-bold text-gov-navy-900">
                  Crowd-Sourced Field Reports
                </h2>
                <p className="text-sm text-slate-600 mt-1">Real-time reports from citizens & field officers</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-slate-700 bg-white px-3 py-1.5 rounded-md border border-slate-300">
                {recentReports.length} reports
              </span>
              {recentReports.length < 20 && (
                <button
                  onClick={seedMoreReports}
                  disabled={seeding}
                  className="px-3 py-1.5 rounded-md bg-gov-navy-100 hover:bg-gov-navy-200 text-gov-navy-900 font-semibold text-sm border border-gov-navy-300 transition-colors disabled:opacity-50"
                >
                  {seeding ? 'Generating...' : 'Add Sample Data'}
                </button>
              )}
            </div>
          </div>

          {/* Reports Grid - 4 columns */}
          {recentReports.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-max">
              {recentReports
                .sort((a, b) => {
                  const severityOrder = { CATASTROPHIC: 0, SEVERE: 1, MODERATE: 2, MINOR: 3 };
                  return (severityOrder[a.severity as keyof typeof severityOrder] ?? 4) - 
                         (severityOrder[b.severity as keyof typeof severityOrder] ?? 4);
                })
                .map((report) => {
                  const colors = getSeverityColors(report.severity);
                  const isVerified = report.status === 'VERIFIED';

                  return (
                    <div
                      key={report.id}
                      onClick={() => setSelectedReport(report)}
                      className={`p-4 rounded-md border transition-all space-y-3 flex flex-col group hover:shadow-md cursor-pointer overflow-hidden ${colors.bg} ${colors.border}`}
                    >
                      {/* Status Badges */}
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <span className={`px-2.5 py-1 rounded-sm text-xs font-bold whitespace-nowrap ${colors.badge}`}>
                          {report.severity}
                        </span>
                        <span className={`px-2.5 py-1 rounded-sm text-xs font-bold whitespace-nowrap flex-shrink-0 ${
                          isVerified
                            ? 'bg-green-700 text-white'
                            : 'bg-amber-700 text-white'
                        }`}>
                          {report.status}
                        </span>
                      </div>

                      {/* Thumbnail Image */}
                      <div className="w-full h-40 rounded-md border border-slate-300 bg-slate-200 overflow-hidden group-hover:border-slate-400 transition-all relative">
                        <img
                          src={`/report-photo-${report.id}.jpg`}
                          alt="Report"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                            const parent = (e.target as HTMLImageElement).parentElement;
                            if (parent && !parent.querySelector('[data-placeholder]')) {
                              const placeholder = document.createElement('div');
                              placeholder.setAttribute('data-placeholder', 'true');
                              placeholder.className = 'absolute inset-0 bg-gradient-to-br from-slate-300 to-slate-400 flex items-center justify-center text-slate-600 text-3xl';
                              placeholder.innerHTML = '<span>📸</span>';
                              parent.appendChild(placeholder);
                            }
                          }}
                        />
                      </div>

                      {/* Location & Description */}
                      <div className="space-y-2 flex-grow">
                        <h4 className={`font-bold text-sm line-clamp-2 leading-snug ${colors.headerText}`}>
                          {report.locationDescription}
                        </h4>
                        <p className={`text-xs line-clamp-2 leading-relaxed ${colors.text}`}>
                          {report.description || 'No additional notes provided.'}
                        </p>
                      </div>

                      {/* Type Badge */}
                      <div className="pt-2 border-t border-slate-300">
                        <span className={`inline-block text-xs px-2.5 py-1 rounded-sm font-medium ${colors.badge}`}>
                          {report.landslideType.replace('_', ' ')}
                        </span>
                      </div>

                      {/* Reporter Info & Time */}
                      <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-300 text-xs">
                        <span className="text-slate-700 truncate font-medium">
                          {report.reporterName}
                        </span>
                        <span className="text-slate-600 whitespace-nowrap flex-shrink-0">
                          {new Date(report.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  );
                })}
            </div>
          ) : (
            <div className="p-12 text-center rounded-md bg-white border border-slate-300">
              <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-base text-slate-900 mb-2 font-medium">No field reports yet</p>
              <p className="text-sm text-slate-600 mb-6">Reports from field officers and citizens will appear here</p>
              <button
                onClick={seedMoreReports}
                disabled={seeding}
                className="px-5 py-2.5 rounded-md bg-gov-navy-900 hover:bg-gov-navy-700 text-white font-semibold text-sm border border-gov-navy-700 transition-colors disabled:opacity-50"
              >
                {seeding ? 'Generating...' : 'Generate Sample Reports'}
              </button>
            </div>
          )}
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

      {/* Report Details Modal */}
      <ReportDetailsModal
        report={selectedReport}
        isOpen={!!selectedReport}
        onClose={() => setSelectedReport(null)}
      />

      {/* Broadcast Alert Modal */}
      {isDispatchModalOpen && (
        <DispatchAlertModal
          isOpen={isDispatchModalOpen}
          onClose={() => setIsDispatchModalOpen(false)}
          onAlertDispatched={loadData}
          districts={districts}
        />
      )}

    </div>
  );
};
