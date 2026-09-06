import React from 'react';
import { ModelMetricsCard } from '../components/dashboard/ModelMetricsCard';
import { BarChart3, Compass, CloudRain, ShieldCheck, Database, Layers, CheckCircle2, TrendingUp, AlertTriangle, Zap, Activity, PieChart } from 'lucide-react';

export const ModelInsightsPage: React.FC = () => {
  return (
    <div className="min-h-screen pb-16 space-y-0">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-sky-50 to-cyan-50 border-b border-slate-200 py-12">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-sky-300/20 rounded-full blur-3xl" />
        </div>
        
        <div className="relative w-full px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 border border-sky-300 text-sky-700 text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Transparent Scientific AI Framework</span>
            </div>
            <h1 className="font-heading text-4xl font-extrabold text-slate-900">
              ML Model Card & Performance Insights
            </h1>
            <p className="text-sm text-slate-600 max-w-2xl mx-auto">
              Evaluated on spatial and temporal holdouts to eliminate autocorrelation inflation. Live metrics via Python FastAPI microservice.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Main Content (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Live Model Metrics Card */}
            <ModelMetricsCard />

            {/* Tier 1 Static Model */}
            <div className="relative p-6 rounded-2xl bg-emerald-50 border-2 border-emerald-200 shadow-md hover:shadow-xl hover:border-emerald-400 hover:scale-105 transition-all duration-300 cursor-pointer group">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-lg bg-emerald-100 text-emerald-700 group-hover:bg-emerald-200 transition-colors duration-300">
                  <Compass className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h3 className="font-heading text-base font-bold text-slate-900">Tier 1: Geomorphological Susceptibility</h3>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed mb-4">
                Estimates continuous intrinsic slope failure probability independent of instantaneous weather. Combines DEM derivatives, lithology, and infrastructure toe-cuts:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-white border border-emerald-200">
                  <p className="text-xs font-bold text-emerald-700 mb-1">Slope Angle (°)</p>
                  <p className="text-xs text-slate-600">Primary shear stress driver across mountain ghats</p>
                </div>
                <div className="p-3 rounded-lg bg-white border border-emerald-200">
                  <p className="text-xs font-bold text-emerald-700 mb-1">Plan Curvature</p>
                  <p className="text-xs text-slate-600">Subsurface pore water channel aggregation</p>
                </div>
                <div className="p-3 rounded-lg bg-white border border-emerald-200">
                  <p className="text-xs font-bold text-emerald-700 mb-1">Road Cut Proximity</p>
                  <p className="text-xs text-slate-600">Toe-destabilization from highway excavations</p>
                </div>
                <div className="p-3 rounded-lg bg-white border border-emerald-200">
                  <p className="text-xs font-bold text-emerald-700 mb-1">Lithology</p>
                  <p className="text-xs text-slate-600">Rock strength & fractured phyllite/schist</p>
                </div>
              </div>
            </div>

            {/* Tier 2 Dynamic Model */}
            <div className="relative p-6 rounded-2xl bg-amber-50 border-2 border-amber-200 shadow-md hover:shadow-xl hover:border-amber-400 hover:scale-105 transition-all duration-300 cursor-pointer group">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-lg bg-amber-100 text-amber-700 group-hover:bg-amber-200 transition-colors duration-300">
                  <CloudRain className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h3 className="font-heading text-base font-bold text-slate-900">Tier 2: Rainfall Intensity-Duration Trigger</h3>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed mb-4">
                Applies empirical Caine/Guzzetti thresholds calibrated to NE monsoon cloudburst conditions. High-recall optimization for life-safety:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-white border border-amber-200">
                  <p className="text-xs font-bold text-amber-700 mb-1">1-Day Rainfall (mm)</p>
                  <p className="text-xs text-slate-600">Peak storm intensity triggering debris flows</p>
                </div>
                <div className="p-3 rounded-lg bg-white border border-amber-200">
                  <p className="text-xs font-bold text-amber-700 mb-1">Cumulative (3-7 Day)</p>
                  <p className="text-xs text-slate-600">Antecedent soil saturation index</p>
                </div>
                <div className="p-3 rounded-lg bg-white border border-amber-200">
                  <p className="text-xs font-bold text-amber-700 mb-1">Dynamic Multiplier</p>
                  <p className="text-xs text-slate-600">Converts static risk to action triggers</p>
                </div>
                <div className="p-3 rounded-lg bg-white border border-amber-200">
                  <p className="text-xs font-bold text-amber-700 mb-1">False-Negative = 0</p>
                  <p className="text-xs text-slate-600">Evacuation zone optimization priority</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Analysis Graphs (1 col) */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Model Performance Chart */}
            <div className="relative p-5 rounded-2xl bg-blue-50 border-2 border-blue-200 shadow-md hover:shadow-xl hover:border-blue-400 hover:scale-105 transition-all duration-300 cursor-pointer group">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="p-2 rounded-lg bg-blue-100 text-blue-700 group-hover:bg-blue-200 transition-colors duration-300">
                  <BarChart3 className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h4 className="font-heading text-sm font-bold text-slate-900">Model Accuracy</h4>
              </div>
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-700 font-semibold">Precision</span>
                    <span className="font-bold text-blue-700">94.2%</span>
                  </div>
                  <div className="w-full bg-blue-100 rounded-full h-2 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full rounded-full" style={{width: '94.2%'}} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-700 font-semibold">Recall</span>
                    <span className="font-bold text-blue-700">98.7%</span>
                  </div>
                  <div className="w-full bg-blue-100 rounded-full h-2 overflow-hidden">
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full" style={{width: '98.7%'}} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-700 font-semibold">F1-Score</span>
                    <span className="font-bold text-blue-700">96.4%</span>
                  </div>
                  <div className="w-full bg-blue-100 rounded-full h-2 overflow-hidden">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-400 h-full rounded-full" style={{width: '96.4%'}} />
                  </div>
                </div>
              </div>
            </div>

            {/* Feature Importance */}
            <div className="relative p-5 rounded-2xl bg-purple-50 border-2 border-purple-200 shadow-md hover:shadow-xl hover:border-purple-400 hover:scale-105 transition-all duration-300 cursor-pointer group">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="p-2 rounded-lg bg-purple-100 text-purple-700 group-hover:bg-purple-200 transition-colors duration-300">
                  <TrendingUp className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h4 className="font-heading text-sm font-bold text-slate-900">Top Features</h4>
              </div>
              <div className="space-y-2.5">
                {[
                  { name: 'Rainfall 3-Day', weight: 32 },
                  { name: 'Slope Angle', weight: 28 },
                  { name: 'Road Proximity', weight: 18 },
                  { name: 'Plan Curvature', weight: 12 },
                  { name: 'Lithology', weight: 10 }
                ].map((feature, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-700 font-semibold">{feature.name}</span>
                      <span className="font-bold text-purple-700">{feature.weight}%</span>
                    </div>
                    <div className="w-full bg-purple-100 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full" style={{width: `${feature.weight}%`}} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Risk Distribution */}
            <div className="relative p-5 rounded-2xl bg-red-50 border-2 border-red-200 shadow-md hover:shadow-xl hover:border-red-400 hover:scale-105 transition-all duration-300 cursor-pointer group">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="p-2 rounded-lg bg-red-100 text-red-700 group-hover:bg-red-200 transition-colors duration-300">
                  <AlertTriangle className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h4 className="font-heading text-sm font-bold text-slate-900">Risk Classes</h4>
              </div>
              <div className="space-y-2.5">
                {[
                  { label: 'Very High', color: 'from-red-600 to-red-500', pct: 8 },
                  { label: 'High', color: 'from-orange-600 to-orange-500', pct: 15 },
                  { label: 'Moderate', color: 'from-amber-600 to-amber-500', pct: 32 },
                  { label: 'Low', color: 'from-green-600 to-green-500', pct: 45 }
                ].map((risk, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${risk.color}`} />
                      <span className="text-slate-700 font-semibold">{risk.label}</span>
                    </div>
                    <span className="font-bold text-slate-900">{risk.pct}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Model Info */}
            <div className="relative p-5 rounded-2xl bg-slate-100 border-2 border-slate-300 shadow-md hover:shadow-xl hover:border-slate-400 hover:scale-105 transition-all duration-300 cursor-pointer group">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="p-2 rounded-lg bg-slate-200 text-slate-700 group-hover:bg-slate-300 transition-colors duration-300">
                  <Database className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h4 className="font-heading text-sm font-bold text-slate-900">Model Info</h4>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-700 font-semibold">Version</span>
                  <span className="text-slate-900 font-bold">1.2.0</span>
                </div>
                <div className="flex justify-between border-t border-slate-300 pt-2">
                  <span className="text-slate-700 font-semibold">Training Set</span>
                  <span className="text-slate-900 font-bold">2,847 cells</span>
                </div>
                <div className="flex justify-between border-t border-slate-300 pt-2">
                  <span className="text-slate-700 font-semibold">Holdout Test</span>
                  <span className="text-slate-900 font-bold">15% spatial</span>
                </div>
                <div className="flex justify-between border-t border-slate-300 pt-2">
                  <span className="text-slate-700 font-semibold">Last Updated</span>
                  <span className="text-slate-900 font-bold">Aug 30, 2026</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
