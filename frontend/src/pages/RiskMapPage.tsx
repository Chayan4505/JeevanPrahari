import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { GISMap } from '../components/map/GISMap';
import { api } from '../services/api';
import { 
  District, 
  HeatmapResponse, 
  LandslideReport, 
  RoadSegment, 
  Village 
} from '../types';
import { 
  Layers, RefreshCw, AlertTriangle, MapPin, Activity, Cloud, Droplets, 
  TrendingUp, Eye, EyeOff, Zap, Navigation, BarChart3, Clock 
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const RiskMapPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialDist = searchParams.get('district') || 'IN-ML-EKH';

  const { t } = useLanguage();
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>(initialDist);
  const [districts, setDistricts] = useState<District[]>([]);
  const [heatmapData, setHeatmapData] = useState<HeatmapResponse | null>(null);
  const [roadSegments, setRoadSegments] = useState<RoadSegment[]>([]);
  const [villages, setVillages] = useState<Village[]>([]);
  const [reports, setReports] = useState<LandslideReport[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [recomputing, setRecomputing] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Layer visibility toggles
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [showRoads, setShowRoads] = useState(true);
  const [showVillages, setShowVillages] = useState(true);
  const [showReports, setShowReports] = useState(true);

  const loadAllData = async (distId: string) => {
    setLoading(true);
    try {
      const [dList, hMap, rList, vList, repList] = await Promise.all([
        api.weather.getDistricts(),
        api.risk.getHeatmap(distId),
        api.dashboard.getRoadConnectivity(distId),
        api.dashboard.getPriorityVillages(distId),
        api.reports.getAll(distId),
      ]);
      setDistricts(dList);
      setHeatmapData(hMap);
      setRoadSegments(rList);
      setVillages(vList);
      setReports(repList);
      setLastUpdated(new Date());
    } catch (e) {
      console.warn('Error loading GIS map layers:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData(selectedDistrictId);
    setSearchParams({ district: selectedDistrictId });
  }, [selectedDistrictId]);

  const handleRecompute = async () => {
    setRecomputing(true);
    try {
      await api.risk.recomputeRisk(selectedDistrictId);
      await loadAllData(selectedDistrictId);
    } catch (e: any) {
      alert('Risk recomputation notice: ' + e.message);
    } finally {
      setRecomputing(false);
    }
  };

  const selectedDistObj = districts.find((d) => d.id === selectedDistrictId);
  const highHazardCount = (heatmapData?.highRiskPoints || 0) + (heatmapData?.veryHighRiskPoints || 0);
  const hazardPercentage = heatmapData?.totalPoints ? Math.round((highHazardCount / heatmapData.totalPoints) * 100) : 0;

  // High Risk Zones with Satellite Imagery
  const riskZones = [
    {
      id: 1,
      name: 'Mundakkai Zone',
      location: 'East Khasi Hills',
      riskLevel: 'VERY_HIGH',
      image: '/high-risk-zone-1.jpg',
      description: 'Active landslide corridor with steep slopes',
      satellite: 'Before landslide event - April 2024'
    },
    {
      id: 2,
      name: 'Chooramtala Impact Zone',
      location: 'Mundakkai, East Khasi Hills',
      riskLevel: 'VERY_HIGH',
      image: '/high-risk-zone-2.jpg',
      description: 'July 2024 landslide impact area - Before/After satellite',
      satellite: 'After landslide event - August 2024'
    },
    {
      id: 3,
      name: 'Active Risk Corridor',
      location: 'Kamrup, Guwahati - ASSAM.',
      riskLevel: 'HIGH',
      image: '/high-risk-zone-3.jpg',
      description: 'Monsoon-triggered susceptibility zone',
      satellite: 'Current satellite imagery - 2025'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-cyan-50 to-slate-50">
      
      {/* Hero Header with Gradient Background */}
      <div className="relative overflow-hidden bg-gradient-to-r from-sky-100/80 via-cyan-50/80 to-slate-100/80 border-b border-slate-300">
        <div className="absolute inset-0 bg-grid-white/[0.02] -z-0" />
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-sky-200/20 rounded-full blur-3xl -z-0" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-200/15 rounded-full blur-3xl -z-0" />
        
        <div className="w-full px-4 sm:px-6 lg:px-8 py-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            {/* Left: Title & District Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-sky-200 text-sky-700 border border-sky-300 backdrop-blur-sm">
                  <Layers className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold font-heading bg-gradient-to-r from-sky-700 via-cyan-600 to-emerald-600 bg-clip-text text-transparent">
                    Real-Time Risk Heatmap
                  </h1>
                  <p className="text-sm text-slate-600">GIS-based landslide susceptibility & dynamic trigger analysis</p>
                </div>
              </div>
              
              {/* District & Weather Quick Stats */}
              <div className="flex flex-wrap items-center gap-4 mt-4 pl-12">
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-slate-300 backdrop-blur">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm font-semibold text-emerald-700">{selectedDistObj?.name || selectedDistrictId}</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-slate-300 backdrop-blur">
                  <Droplets className="w-4 h-4 text-sky-600" />
                  <span className="text-sm"><span className="font-bold text-sky-700">{selectedDistObj?.currentRainfall24h || 0}mm</span> <span className="text-slate-600">(24h)</span></span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-slate-300 backdrop-blur">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span className="text-xs text-amber-700">Updated {Math.round((Date.now() - lastUpdated.getTime()) / 1000)}s ago</span>
                </div>
              </div>
            </div>

            {/* Right: Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={handleRecompute}
                disabled={recomputing}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-700 hover:to-cyan-700 text-white font-semibold text-sm border border-sky-400 flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-sky-500/20"
              >
                <RefreshCw className={`w-4 h-4 ${recomputing ? 'animate-spin' : ''}`} />
                <span>{recomputing ? 'Recalculating...' : 'Refresh Risk'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Control Panel with Layer Toggles */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button
            onClick={() => setShowHeatmap(!showHeatmap)}
            className={`p-4 rounded-xl border transition-all duration-200 ${
              showHeatmap
                ? 'bg-gradient-to-br from-red-100 to-orange-100 border-red-300 shadow-lg shadow-red-200'
                : 'bg-slate-100 border-slate-300 hover:border-slate-400'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${showHeatmap ? 'bg-red-200' : 'bg-slate-200'}`}>
                <TrendingUp className={`w-5 h-5 ${showHeatmap ? 'text-red-700' : 'text-slate-600'}`} />
              </div>
              <div className="text-left">
                <p className="text-xs font-semibold text-slate-800">Heatmap</p>
                <p className="text-xs text-slate-600">{showHeatmap ? 'Visible' : 'Hidden'}</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => setShowRoads(!showRoads)}
            className={`p-4 rounded-xl border transition-all duration-200 ${
              showRoads
                ? 'bg-gradient-to-br from-purple-100 to-blue-100 border-purple-300 shadow-lg shadow-purple-200'
                : 'bg-slate-100 border-slate-300 hover:border-slate-400'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${showRoads ? 'bg-purple-200' : 'bg-slate-200'}`}>
                <Navigation className={`w-5 h-5 ${showRoads ? 'text-purple-700' : 'text-slate-600'}`} />
              </div>
              <div className="text-left">
                <p className="text-xs font-semibold text-slate-800">Roads</p>
                <p className="text-xs text-slate-600">{showRoads ? 'Visible' : 'Hidden'}</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => setShowVillages(!showVillages)}
            className={`p-4 rounded-xl border transition-all duration-200 ${
              showVillages
                ? 'bg-gradient-to-br from-cyan-100 to-emerald-100 border-cyan-300 shadow-lg shadow-cyan-200'
                : 'bg-slate-100 border-slate-300 hover:border-slate-400'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${showVillages ? 'bg-cyan-200' : 'bg-slate-200'}`}>
                <Activity className={`w-5 h-5 ${showVillages ? 'text-cyan-700' : 'text-slate-600'}`} />
              </div>
              <div className="text-left">
                <p className="text-xs font-semibold text-slate-800">Villages</p>
                <p className="text-xs text-slate-600">{showVillages ? 'Visible' : 'Hidden'}</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => setShowReports(!showReports)}
            className={`p-4 rounded-xl border transition-all duration-200 ${
              showReports
                ? 'bg-gradient-to-br from-amber-100 to-orange-100 border-amber-300 shadow-lg shadow-amber-200'
                : 'bg-slate-100 border-slate-300 hover:border-slate-400'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${showReports ? 'bg-amber-200' : 'bg-slate-200'}`}>
                <AlertTriangle className={`w-5 h-5 ${showReports ? 'text-amber-700' : 'text-slate-600'}`} />
              </div>
              <div className="text-left">
                <p className="text-xs font-semibold text-slate-800">Reports</p>
                <p className="text-xs text-slate-600">{showReports ? 'Visible' : 'Hidden'}</p>
              </div>
            </div>
          </button>
        </div>

        {/* Main Map & Right Panel - 60:40 Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 h-auto">
          
          {/* Left: GIS Map (60% / 6 cols) */}
          <div className="lg:col-span-6 w-full rounded-2xl overflow-hidden border border-slate-300 shadow-2xl h-[700px]">
            <GISMap
              heatmapPoints={showHeatmap ? heatmapData?.points || [] : []}
              roadSegments={showRoads ? roadSegments : []}
              villages={showVillages ? villages : []}
              reports={showReports ? reports : []}
              selectedDistrictId={selectedDistrictId}
              districts={districts}
              onSelectDistrict={(id) => setSelectedDistrictId(id)}
            />
          </div>

          {/* Right: Risk Zone Images Panel (40% / 4 cols) */}
          <div className="lg:col-span-4 space-y-5">
            {/* Risk Zone Images - 3 cards */}
            {riskZones.map((zone) => (
              <div
                key={zone.id}
                className="group relative rounded-2xl overflow-hidden border border-slate-300 hover:border-red-400 transition-all duration-300 h-[215px] bg-gradient-to-br from-slate-200 via-slate-300 to-slate-400 cursor-pointer hover:shadow-lg hover:shadow-red-200"
              >
                {/* Satellite Image - Full cover */}
                <img
                  src={zone.image}
                  alt={zone.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 z-0"
                />
                
                {/* Risk Level Badge - Top Right Corner */}
                <div className="absolute top-3 right-3 z-10">
                  <span className={`inline-block px-4 py-2 rounded-lg text-white text-xs font-bold border shadow-lg whitespace-nowrap ${
                    zone.riskLevel === 'VERY_HIGH' 
                      ? 'bg-red-600 border-red-500 hover:bg-red-700' 
                      : 'bg-orange-600 border-orange-500 hover:bg-orange-700'
                  }`}>
                    {zone.riskLevel === 'VERY_HIGH' ? 'VERY HIGH' : 'HIGH'}
                  </span>
                </div>

                {/* Gradient overlay - Bottom (always on top) */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-900/90 via-slate-900/50 to-transparent z-20">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-white text-sm group-hover:text-red-100 transition-colors">
                        {zone.name}
                      </h3>
                      <p className="text-xs text-slate-200 mt-1 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {zone.location}
                      </p>
                      <p className="text-xs text-slate-300 mt-1.5 leading-snug">{zone.description}</p>
                      <p className="text-xs text-slate-400 mt-2 italic">📡 {zone.satellite}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Real-Time Statistics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Grid Cells */}
          <div className="group relative p-6 rounded-2xl bg-gradient-to-br from-white to-slate-50 border border-slate-300 hover:border-emerald-400 transition-all duration-300 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 rounded-xl bg-emerald-100 text-emerald-700 border border-emerald-300">
                  <Activity className="w-5 h-5" />
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 font-semibold">Live</span>
              </div>
              <p className="text-sm text-slate-600 mb-1">Active Grid Cells</p>
              <p className="text-3xl font-bold text-slate-900">{heatmapData?.totalPoints || 0}</p>
              <p className="text-xs text-slate-500 mt-2">Monitored in {selectedDistObj?.name || 'region'}</p>
            </div>
          </div>

          {/* High Hazard Zones */}
          <div className="group relative p-6 rounded-2xl bg-gradient-to-br from-white to-slate-50 border border-slate-300 hover:border-red-400 transition-all duration-300 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 rounded-xl bg-red-100 text-red-700 border border-red-300">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                  hazardPercentage > 20 ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                }`}>{hazardPercentage}%</span>
              </div>
              <p className="text-sm text-slate-600 mb-1">High/Very High Risk</p>
              <p className="text-3xl font-bold text-red-600">{highHazardCount}</p>
              <p className="text-xs text-slate-500 mt-2">Critical zones requiring attention</p>
            </div>
          </div>

          {/* Incident Reports */}
          <div className="group relative p-6 rounded-2xl bg-gradient-to-br from-white to-slate-50 border border-slate-300 hover:border-amber-400 transition-all duration-300 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 rounded-xl bg-amber-100 text-amber-700 border border-amber-300">
                  <MapPin className="w-5 h-5" />
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 font-semibold">New</span>
              </div>
              <p className="text-sm text-slate-600 mb-1">Verified Reports</p>
              <p className="text-3xl font-bold text-amber-600">{reports.length}</p>
              <p className="text-xs text-slate-500 mt-2">Field-verified incidents</p>
            </div>
          </div>

          {/* Priority Villages */}
          <div className="group relative p-6 rounded-2xl bg-gradient-to-br from-white to-slate-50 border border-slate-300 hover:border-cyan-400 transition-all duration-300 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 rounded-xl bg-cyan-100 text-cyan-700 border border-cyan-300">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-cyan-100 text-cyan-700 font-semibold">Alert</span>
              </div>
              <p className="text-sm text-slate-600 mb-1">Priority Villages</p>
              <p className="text-3xl font-bold text-cyan-600">{villages.length}</p>
              <p className="text-xs text-slate-500 mt-2">High-risk settlements</p>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="p-4 rounded-xl bg-slate-100 border border-slate-300 text-center text-xs text-slate-700">
          <span>Last refreshed: {lastUpdated.toLocaleTimeString()}</span>
          <span className="mx-2">•</span>
          <span>Data updates every 30 minutes or on manual refresh</span>
        </div>
      </div>
    </div>
  );
};
