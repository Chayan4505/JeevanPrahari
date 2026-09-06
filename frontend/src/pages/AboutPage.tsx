import React from 'react';
import { ShieldAlert, Database, Server, Cpu, Smartphone, CheckCircle2, Globe, Heart } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Hero */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 border border-sky-300 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-7 h-7" />
        </div>
        <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-900">
          About JeevanPrahari
        </h1>
        <p className="text-sm text-slate-700 leading-relaxed">
          "Mountain Companion" — A unified, production-grade landslide early warning and risk monitoring platform built specifically for the vulnerable hill districts of North East India.
        </p>
      </div>

      {/* Project Mission */}
      <div className="p-6 sm:p-8 rounded-2xl bg-emerald-50 border-2 border-emerald-200 shadow-md hover:shadow-xl hover:border-emerald-400 hover:scale-105 transition-all duration-300 cursor-pointer group">
        <h2 className="font-heading text-xl font-bold text-emerald-700 mb-4">
          The Problem & Our Mission
        </h2>
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mb-3">
          The North Eastern Region (NER) of India—spanning Meghalaya, Assam, Sikkim, Mizoram, Nagaland, Arunachal Pradesh, Manipur, and Tripura—experiences some of the highest monsoon precipitation globally. Steep topography, active tectonic thrust zones, and highway toe-cutting excavations create acute vulnerability to sudden, catastrophic debris flows and rockslides.
        </p>
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
          <strong className="text-slate-900">JeevanPrahari</strong> provides an end-to-end bridge between scientific geomorphological susceptibility models, real-time meteorological rainfall telemetry, and actionable, multilingual emergency broadcasts conforming to the National Disaster Management Authority (NDMA) Common Alerting Protocol standard.
        </p>
      </div>

      {/* 3-Tier Technical Architecture */}
      <div className="space-y-6">
        <h2 className="font-heading text-xl font-bold text-slate-900 text-center">
          Three-Tier Production Architecture
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Backend */}
          <div className="p-6 rounded-2xl bg-blue-50 border-2 border-blue-200 shadow-md hover:shadow-xl hover:border-blue-400 hover:scale-105 transition-all duration-300 cursor-pointer group">
            <div className="p-3 w-fit rounded-xl bg-blue-100 text-blue-700 group-hover:bg-blue-200 transition-colors duration-300 mb-3">
              <Server className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
            </div>
            <h3 className="font-heading text-base font-bold text-slate-900 mb-2">Java Spring Boot 3.x Backend</h3>
            <p className="text-xs text-slate-700 leading-relaxed">
              Google OAuth2 & JWT session management, PostGIS spatial queries, MinIO media storage, and asynchronous RabbitMQ fanout to SMS & Push adapters.
            </p>
          </div>

          {/* ML Microservice */}
          <div className="p-6 rounded-2xl bg-emerald-50 border-2 border-emerald-200 shadow-md hover:shadow-xl hover:border-emerald-400 hover:scale-105 transition-all duration-300 cursor-pointer group">
            <div className="p-3 w-fit rounded-xl bg-emerald-100 text-emerald-700 group-hover:bg-emerald-200 transition-colors duration-300 mb-3">
              <Cpu className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
            </div>
            <h3 className="font-heading text-base font-bold text-slate-900 mb-2">Python ML Microservice</h3>
            <p className="text-xs text-slate-700 leading-relaxed">
              FastAPI scoring engine running Tier 1 Static Susceptibility (Random Forest & XGBoost) and Tier 2 Dynamic Rainfall Trigger Threshold models.
            </p>
          </div>

          {/* Frontend */}
          <div className="p-6 rounded-2xl bg-amber-50 border-2 border-amber-200 shadow-md hover:shadow-xl hover:border-amber-400 hover:scale-105 transition-all duration-300 cursor-pointer group">
            <div className="p-3 w-fit rounded-xl bg-amber-100 text-amber-700 group-hover:bg-amber-200 transition-colors duration-300 mb-3">
              <Smartphone className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
            </div>
            <h3 className="font-heading text-base font-bold text-slate-900 mb-2">React 18 + Vite GIS PWA</h3>
            <p className="text-xs text-slate-700 leading-relaxed">
              Interactive Leaflet GIS heatmap, offline-first citizen reporting with camera & IndexedDB queue, and District Command Center.
            </p>
          </div>

        </div>
      </div>

      {/* Public Data Sources & Attribution Table */}
      <div className="p-6 sm:p-8 rounded-2xl bg-sky-50 border-2 border-sky-200 shadow-md hover:shadow-xl hover:border-sky-400 hover:scale-105 transition-all duration-300 cursor-pointer group">
        <h2 className="font-heading text-xl font-bold text-slate-900 flex items-center gap-2 mb-4">
          <div className="p-2 rounded-lg bg-sky-100 text-sky-700 group-hover:bg-sky-200 transition-colors duration-300">
            <Database className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
          </div>
          Public Data Sources & Attribution
        </h2>
        <p className="text-xs text-slate-700 mb-4">
          PahaarSaathi relies strictly on official open data repositories and verified government APIs:
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b-2 border-sky-300 text-slate-700">
                <th className="pb-3 font-bold text-slate-900">Data Layer</th>
                <th className="pb-3 font-bold text-slate-900">Official Source</th>
                <th className="pb-3 font-bold text-slate-900">Access / Integration Mode</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sky-200 text-slate-700">
              <tr>
                <td className="py-3 font-bold text-slate-900">Live & Forecast Rainfall</td>
                <td className="py-3">Open-Meteo & IMD (api.imd.gov.in)</td>
                <td className="py-3 text-emerald-700 font-semibold">Open API (Open-Meteo active default; IMD swappable adapter)</td>
              </tr>
              <tr>
                <td className="py-3 font-bold text-slate-900">Digital Elevation Model (DEM)</td>
                <td className="py-3">SRTM 30m / OpenTopography & ISRO Bhuvan</td>
                <td className="py-3 text-slate-700">Open spatial rasters</td>
              </tr>
              <tr>
                <td className="py-3 font-bold text-slate-900">Historical Landslide Inventory</td>
                <td className="py-3">GSI Bhooskhalan & NRSC Landslide Portal</td>
                <td className="py-3 text-slate-700">Public geomorphological inventories</td>
              </tr>
              <tr>
                <td className="py-3 font-bold text-slate-900">Roads & Village Vectors</td>
                <td className="py-3">OpenStreetMap (OSM) via Overpass</td>
                <td className="py-3 text-slate-700">Open Database License (ODbL)</td>
              </tr>
              <tr>
                <td className="py-3 font-bold text-slate-900">Alert Protocol Standard</td>
                <td className="py-3">NDMA OASIS CAP v1.2 XML</td>
                <td className="py-3 text-emerald-700 font-semibold">Open Standard</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
