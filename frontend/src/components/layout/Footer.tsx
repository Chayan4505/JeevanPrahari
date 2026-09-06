import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, PhoneCall, ExternalLink, Heart, Clock, Database, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const Footer: React.FC = () => {
  const { t } = useLanguage();
  const currentTimestamp = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }) + ' IST, ' + new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <footer className="w-full border-t border-slate-800/50 bg-gradient-to-b from-slate-950 to-slate-950/95 text-slate-400 mt-auto">
      {/* Main Footer Content - Full Width No Padding */}
      <div className="w-full py-12 lg:py-14">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
            
            {/* Column 1 — Brand & Purpose */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 group">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
                  <ShieldAlert className="w-5 h-5 text-white" />
                </div>
                <span className="font-heading text-lg font-bold text-white tracking-tight">
                  JeevanPrahari
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
                Empowering North Eastern hill communities, travelers, and district disaster administrators with real-time landslide early warning, terrain susceptibility, and dynamic rainfall trigger intelligence.
              </p>
              <div className="flex items-center gap-2.5 pt-1 text-[11px] text-emerald-400 font-semibold bg-emerald-950/30 px-3 py-1.5 rounded-lg border border-emerald-500/20 w-fit">
                <CheckCircle2 className="w-4 h-4" />
                <span>NDMA CAP 1.2 Compliant</span>
              </div>
            </div>

            {/* Column 2 — Quick Navigation */}
            <div className="space-y-4">
              <h4 className="font-heading text-xs uppercase tracking-widest text-slate-200 font-bold">
                📍 Quick Navigation
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link to="/" className="text-slate-400 hover:text-emerald-400 transition-colors font-medium flex items-center gap-2">
                    <span>→</span> {t.navHome}
                  </Link>
                </li>
                <li>
                  <Link to="/map" className="text-slate-400 hover:text-emerald-400 transition-colors font-medium flex items-center gap-2">
                    <span>→</span> {t.navRiskMap}
                  </Link>
                </li>
                <li>
                  <Link to="/report" className="text-slate-400 hover:text-emerald-400 transition-colors font-medium flex items-center gap-2">
                    <span>→</span> {t.navReport}
                  </Link>
                </li>
                <li>
                  <Link to="/alerts" className="text-slate-400 hover:text-emerald-400 transition-colors font-medium flex items-center gap-2">
                    <span>→</span> {t.navAlerts} & Archive
                  </Link>
                </li>
                <li>
                  <Link to="/model-insights" className="text-slate-400 hover:text-emerald-400 transition-colors font-medium flex items-center gap-2">
                    <span>→</span> {t.navModelInsights}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3 — Data Sources & Scientific Attribution */}
            <div className="space-y-4">
              <h4 className="font-heading text-xs uppercase tracking-widest text-slate-200 font-bold flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-400" />
                Data Sources
              </h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Built on verified open data & official spatial infrastructure:
              </p>
              <ul className="space-y-2 text-[11px]">
                <li className="flex items-start justify-between gap-3">
                  <span className="text-slate-500 flex-shrink-0">🌤️</span>
                  <div className="flex-1">
                    <p className="text-slate-400">Weather & Forecast:</p>
                    <p className="text-slate-300 font-semibold text-[10px]">Open-Meteo & IMD</p>
                  </div>
                </li>
                <li className="flex items-start justify-between gap-3">
                  <span className="text-slate-500 flex-shrink-0">⛰️</span>
                  <div className="flex-1">
                    <p className="text-slate-400">DEM (30m Elevation):</p>
                    <p className="text-slate-300 font-semibold text-[10px]">SRTM / OpenTopography</p>
                  </div>
                </li>
                <li className="flex items-start justify-between gap-3">
                  <span className="text-slate-500 flex-shrink-0">📊</span>
                  <div className="flex-1">
                    <p className="text-slate-400">Historical Landslides:</p>
                    <p className="text-slate-300 font-semibold text-[10px]">GSI Bhooskhalan & NRSC</p>
                  </div>
                </li>
                <li className="flex items-start justify-between gap-3">
                  <span className="text-slate-500 flex-shrink-0">🗺️</span>
                  <div className="flex-1">
                    <p className="text-slate-400">Roads & Villages:</p>
                    <p className="text-slate-300 font-semibold text-[10px]">OpenStreetMap (OSM)</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Column 4 — Emergency Helplines */}
            <div className="space-y-4">
              <h4 className="font-heading text-xs uppercase tracking-widest text-slate-200 font-bold">
                🚨 Emergency & Support
              </h4>
              <div className="space-y-2.5">
                {/* National Emergency */}
                <div className="p-3 rounded-lg bg-gradient-to-br from-emerald-950/40 to-emerald-900/20 border border-emerald-500/30 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                    <PhoneCall className="w-3.5 h-3.5 animate-pulse" />
                    <span>National Emergency</span>
                  </div>
                  <p className="text-sm font-bold text-white">112</p>
                </div>

                {/* NER State Helpline */}
                <div className="p-3 rounded-lg bg-gradient-to-br from-red-950/40 to-red-900/20 border border-red-500/30 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-red-400">
                    <PhoneCall className="w-3.5 h-3.5 animate-pulse" />
                    <span>NER State DMA Hotline</span>
                  </div>
                  <p className="text-sm font-bold text-white">1077 / 1070</p>
                </div>

                {/* States Coverage */}
                <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-700/60 text-[10px]">
                  <p className="text-slate-300 font-semibold mb-1">Coverage Areas:</p>
                  <p className="text-slate-400 leading-relaxed">
                    Meghalaya • Assam • Sikkim • Mizoram • Nagaland • Manipur • Tripura • Arunachal Pradesh
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-700/50 to-transparent" />

      {/* Bottom Bar - Full Width No Padding */}
      <div className="w-full py-5 lg:py-6 bg-slate-950/80 backdrop-blur-sm">
        <div className="px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          
          {/* Copyright */}
          <p className="text-center sm:text-left text-[12px]">
            © 2026 <span className="font-semibold text-slate-300">JeevanPrahari</span> • Built for community life-safety and disaster resilience in the North East.
          </p>

          {/* Version & Status */}
          <div className="flex items-center gap-2.5 flex-wrap justify-center sm:justify-end">
            <span className="px-2 py-0.5 rounded-lg bg-slate-900/80 border border-slate-700/60 text-[10px] text-slate-500 font-mono">
              v1.2.0-ner
            </span>
            <div className="flex items-center gap-1.5 text-emerald-400 text-[10px] font-semibold bg-emerald-950/40 border border-emerald-800/40 px-2.5 py-1 rounded-full">
              <Clock className="w-3 h-3 animate-spin" style={{ animationDuration: '8s' }} />
              <span>{t.dataUpdated}: {currentTimestamp}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
