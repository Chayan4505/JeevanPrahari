import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldAlert, 
  Map, 
  AlertTriangle, 
  PhoneCall, 
  Activity, 
  CloudRain, 
  Compass, 
  FileText, 
  CheckCircle2, 
  Layers, 
  ArrowRight,
  Sparkles,
  Database,
  Radio
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Alert, District, OverviewStats } from '../types';

export const HomePage: React.FC = () => {
  const { t } = useLanguage();
  const { isAuthenticated, user } = useAuth();

  const [districts, setDistricts] = useState<District[]>([]);
  const [activeAlerts, setActiveAlerts] = useState<Alert[]>([]);
  const [stats, setStats] = useState<OverviewStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadHomeData() {
      try {
        const [dList, aList, oStats] = await Promise.all([
          api.weather.getDistricts(),
          api.alerts.getActive(),
          api.dashboard.getOverview('IN-ML-EKH'),
        ]);
        setDistricts(dList);
        setActiveAlerts(aList);
        setStats(oStats);
      } catch (e) {
        console.warn('Error fetching homepage data:', e);
      } finally {
        setLoading(false);
      }
    }
    loadHomeData();
  }, []);

  return (
    <div className="space-y-12 pb-16">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 sm:pb-24 border-b border-slate-200 bg-gradient-to-br from-sky-50 via-emerald-50 to-cyan-50">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-200/20 via-transparent to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-sky-200/15 via-transparent to-transparent pointer-events-none" />
        
        <div className="w-full px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-center">
            
            {/* Left Column - Text Content (1 col) */}
            <div className="lg:col-span-1 space-y-6 max-w-2xl">
              
              {/* Tag badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gov-saffron-100 border border-gov-saffron-300 text-gov-saffron-700 text-xs font-bold animate-fade-in">
                <Sparkles className="w-3.5 h-3.5" />
                <span>North Eastern Region Landslide Early Warning System</span>
              </div>

              {/* Main Headline */}
              <h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
                JeevanPrahari <br />
                <span className="bg-gradient-to-r from-emerald-600 via-cyan-500 to-sky-600 bg-clip-text text-transparent">
                  Mountain Companion
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-slate-700 font-normal leading-relaxed">
                Real-time landslide susceptibility modeling, dynamic monsoon rainfall trigger forecasts, and multi-channel NDMA CAP 1.2 alerts for hill communities and emergency disaster managers across North East India.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/map"
                  className="px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2 group"
                >
                  <Map className="w-4 h-4" />
                  <span>{t.viewRiskMap}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  to="/report"
                  className="px-6 py-3.5 rounded-xl bg-sky-100 hover:bg-sky-200 text-slate-900 font-semibold text-sm border border-sky-300 transition-all flex items-center gap-2"
                >
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>{t.reportLandslide}</span>
                </Link>

                <a
                  href="tel:1077"
                  className="px-4 py-3.5 rounded-xl bg-red-100 hover:bg-red-200 text-red-700 border border-red-300 text-sm font-bold flex items-center gap-2 transition-all"
                >
                  <PhoneCall className="w-4 h-4 animate-pulse" />
                  <span>Helpline 1077</span>
                </a>
              </div>

            </div>

            {/* Right Column - PM Photo */}
            <div className="hidden lg:flex lg:col-span-2 items-center justify-end">
              <div className="relative w-full max-w-2xl">
                {/* Decorative background shape */}
                <div className="absolute -inset-6 bg-gradient-to-br from-emerald-200/40 via-sky-200/30 to-cyan-200/40 rounded-3xl blur-3xl" />
                
                {/* Photo Container - Large and Prominent */}
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                  <img
                    src="/pm-modi.png"
                    alt="Prime Minister Narendra Modi"
                    className="w-full h-auto object-cover"
                  />
                </div>

                {/* Badge underneath photo */}
                <div className="mt-6 text-center px-4">
                  <p className="text-sm font-bold text-slate-900">
                    Government of India Initiative
                  </p>
                  {/* <p className="text-xs text-slate-700 mt-1">
                    Ministry of Development of North Eastern Region (MDoNER)
                  </p> */}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Live Alert Marquee / Ticker */}
      {activeAlerts.length > 0 && (
        <section className="w-full px-4 sm:px-6 lg:px-8">
          <div className="p-3.5 rounded-2xl bg-red-100 border border-red-300 shadow-lg flex items-center gap-3">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-600 text-white text-xs font-bold shrink-0">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>LIVE ALERT</span>
            </span>
            <div className="overflow-hidden flex-1 text-xs text-red-800 truncate">
              <strong className="text-red-900 font-bold">{activeAlerts[0].headline}:</strong> {activeAlerts[0].description}
            </div>
            <Link
              to="/alerts"
              className="text-xs text-red-700 hover:text-red-900 font-bold underline shrink-0 hidden sm:block"
            >
              View All ({activeAlerts.length})
            </Link>
          </div>
        </section>
      )}

      {/* 3 Main Pillars / Core Modules */}
      <section className="w-full px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900">
            Scientifically Honest Early Warning Architecture
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            A two-tier prediction methodology mirroring the Geological Survey of India (GSI) Landslide Early Warning System.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Tier 1 */}
          <div className="p-6 rounded-2xl bg-emerald-50 border-2 border-emerald-200 shadow-md hover:shadow-xl hover:border-emerald-400 hover:scale-105 transition-all duration-300 cursor-pointer group">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 border border-emerald-300 flex items-center justify-center group-hover:scale-110 group-hover:bg-emerald-200 transition-all duration-300">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="font-heading text-lg font-bold text-slate-900 mt-4">
              Tier 1 — Static Susceptibility
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed mt-3">
              Trained on DEM slope angles, plan curvature, elevation, distance to road cuts, land-cover, and lithology using Random Forest & XGBoost classifiers.
            </p>
            <div className="pt-3 text-sm text-emerald-700 font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>Evaluated on Spatial Holdouts</span>
            </div>
          </div>

          {/* Tier 2 */}
          <div className="p-6 rounded-2xl bg-amber-50 border-2 border-amber-200 shadow-md hover:shadow-xl hover:border-amber-400 hover:scale-105 transition-all duration-300 cursor-pointer group">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 border border-amber-300 flex items-center justify-center group-hover:scale-110 group-hover:bg-amber-200 transition-all duration-300">
              <CloudRain className="w-6 h-6" />
            </div>
            <h3 className="font-heading text-lg font-bold text-slate-900 mt-4">
              Tier 2 — Dynamic Rainfall Trigger
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed mt-3">
              Empirical rainfall intensity-duration threshold model tracking 1-day, 3-day, and 7-day cumulative antecedent saturation to calculate trigger levels (Watch, Warning, Alert).
            </p>
            <div className="pt-3 text-sm text-amber-700 font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>High Safety Recall on Extreme Events</span>
            </div>
          </div>

          {/* Life Safety Dispatch */}
          <div className="p-6 rounded-2xl bg-red-50 border-2 border-red-200 shadow-md hover:shadow-xl hover:border-red-400 hover:scale-105 transition-all duration-300 cursor-pointer group">
            <div className="w-12 h-12 rounded-xl bg-red-100 text-red-700 border border-red-300 flex items-center justify-center group-hover:scale-110 group-hover:bg-red-200 transition-all duration-300">
              <Radio className="w-6 h-6" />
            </div>
            <h3 className="font-heading text-lg font-bold text-slate-900 mt-4">
              Multi-Channel NDMA CAP Alerting
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed mt-3">
              Asynchronous fan-out via RabbitMQ to SMS gateways, FCM push notifications, and OASIS CAP 1.2 XML with 9 pre-translated North Eastern regional languages.
            </p>
            <div className="pt-3 text-sm text-red-700 font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>Assamese, Bodo, Khasi, Garo, Mizo, Manipuri</span>
            </div>
          </div>

        </div>
      </section>

      {/* Featured Districts Grid */}
      <section className="w-full px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-xl font-bold text-slate-900">
            Monitored NER Districts & Live Status
          </h3>
          <Link to="/map" className="text-xs text-emerald-600 hover:underline font-semibold flex items-center gap-1">
            <span>Explore Map</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {districts.map((d) => {
            const isHigh = d.currentRiskLevel === 'HIGH' || d.currentRiskLevel === 'VERY_HIGH';
            const bgColor = isHigh ? 'bg-red-50 hover:border-red-400' : 'bg-emerald-50 hover:border-emerald-400';
            const borderColor = isHigh ? 'border-red-200' : 'border-emerald-200';
            return (
              <Link
                key={d.id}
                to={`/map?district=${d.id}`}
                className={`p-4 rounded-xl ${bgColor} border-2 ${borderColor} shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer space-y-2.5 block group`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-900 group-hover:text-slate-700 transition-colors">{d.name}</span>
                  <span className={`px-2 py-0.5 rounded-lg text-xs font-bold transition-all ${
                    isHigh ? 'bg-red-100 text-red-700 group-hover:bg-red-200' : 'bg-emerald-100 text-emerald-700 group-hover:bg-emerald-200'
                  }`}>
                    {d.currentRiskLevel}
                  </span>
                </div>
                <p className="text-xs text-slate-600">{d.state}</p>
                <div className="flex items-center justify-between text-xs pt-2 border-t transition-colors" style={{borderColor: isHigh ? '#fecaca' : '#a7f3d0'}}>
                  <span className="text-slate-700">24h Rain: <strong className="text-slate-900">{d.currentRainfall24h}mm</strong></span>
                  <span className={`${isHigh ? 'text-red-600' : 'text-emerald-600'} font-bold text-xs transition-colors`}>{d.triggerStatus}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Rescue Operations Gallery */}
      <section className="w-full px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-6">
          <h3 className="font-heading text-2xl font-bold text-slate-900">
            Field Rescue & Response Operations
          </h3>
          <p className="text-xs sm:text-sm text-slate-600">
            Real-world emergency response and rescue operations across North Eastern India
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* First photo - takes 2 rows vertically (double height) */}
          <div 
            key={1}
            className="relative overflow-hidden rounded-2xl shadow-lg h-32 sm:h-auto sm:row-span-2"
          >
            <img
              src={`/rescue-op-1.jpg`}
              alt={`Rescue Operation 1`}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Photos 2-4 (First row) */}
          {[2, 3, 4].map((num) => (
            <div 
              key={num}
              className="relative overflow-hidden rounded-2xl shadow-lg h-64"
            >
              <img
                src={`/rescue-op-${num}.jpg`}
                alt={`Rescue Operation ${num}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}

          {/* Photos 5-7 (Second row) */}
          {[5, 6, 7].map((num) => (
            <div 
              key={num}
              className="relative overflow-hidden rounded-2xl shadow-lg h-64"
            >
              <img
                src={`/rescue-op-${num}.jpg`}
                alt={`Rescue Operation ${num}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        {/* Info Box */}
        <div className="mt-8 p-5 rounded-2xl bg-blue-50 border-2 border-blue-200 text-center">
          <p className="text-sm text-slate-700 font-medium">
            These images showcase real-world rescue and response operations coordinated by NDRF, SDRF, and local disaster management authorities.
          </p>
        </div>
      </section>

    </div>
  );
};
