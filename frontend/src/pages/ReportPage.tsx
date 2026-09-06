import React, { useState } from 'react';
import { CitizenReportForm } from '../components/report/CitizenReportForm';
import { api } from '../services/api';
import { District } from '../types';
import { AlertCircle, Camera, MapPin, FileText, CheckCircle2, Zap, Shield, AlertTriangle, Clock, PhoneCall } from 'lucide-react';

export const ReportPage: React.FC = () => {
  const [districts, setDistricts] = useState<District[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const loadDistricts = async () => {
    try {
      const dList = await api.weather.getDistricts();
      setDistricts(dList);
    } catch (e) {
      console.warn('Error loading districts:', e);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadDistricts();
  }, []);

  return (
    <div className="min-h-screen pb-16 space-y-0">
      
      {/* Hero Section with Gradient */}
      <div className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 border-b border-slate-200">
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-0 right-0 w-96 h-96 bg-orange-200/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-200/15 rounded-full blur-3xl" />
        </div>
        
        <div className="w-full px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="inline-flex items-center justify-center gap-2 mb-6 px-4 py-2 rounded-full bg-orange-100 border border-orange-300">
            <Zap className="w-4 h-4 text-orange-700" />
            <span className="text-xs font-bold text-orange-700">REAL-TIME CROWD-SOURCED INTELLIGENCE</span>
          </div>
          
          <h1 className="font-heading text-5xl sm:text-6xl font-black text-slate-900 mb-4 leading-tight">
            Report a Landslide Incident
          </h1>
          
          <p className="text-slate-700 max-w-2xl mx-auto text-lg leading-relaxed mb-8">
            Your real-time field reports help save lives. Our AI analyzes photos to verify incidents instantly, triggering emergency alerts across the North East.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold">
            <div className="flex items-center gap-2 text-emerald-700">
              <CheckCircle2 className="w-4 h-4" />
              <span>Works Offline</span>
            </div>
            <div className="text-slate-400">•</div>
            <div className="flex items-center gap-2 text-sky-700">
              <Shield className="w-4 h-4" />
              <span>AI Verification</span>
            </div>
            <div className="text-slate-400">•</div>
            <div className="flex items-center gap-2 text-amber-700">
              <AlertTriangle className="w-4 h-4" />
              <span>Instant Alerts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          {/* Stat 1 */}
          <div className="relative group p-6 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-50/50 border border-emerald-200 hover:border-emerald-400 transition-all">
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <span className="text-emerald-700 font-bold text-sm">Reports Submitted</span>
                <FileText className="w-5 h-5 text-emerald-600/60" />
              </div>
              <p className="text-3xl font-black text-slate-900">17</p>
              <p className="text-xs text-slate-600 mt-2">Active incident records</p>
            </div>
          </div>

          {/* Stat 2 */}
          <div className="relative group p-6 rounded-2xl bg-gradient-to-br from-red-50 to-red-50/50 border border-red-200 hover:border-red-400 transition-all">
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <span className="text-red-700 font-bold text-sm">High Risk Areas</span>
                <AlertCircle className="w-5 h-5 text-red-600/60" />
              </div>
              <p className="text-3xl font-black text-slate-900">4</p>
              <p className="text-xs text-slate-600 mt-2">Severe/Catastrophic incidents</p>
            </div>
          </div>

          {/* Stat 3 */}
          <div className="relative group p-6 rounded-2xl bg-gradient-to-br from-sky-50 to-sky-50/50 border border-sky-200 hover:border-sky-400 transition-all">
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sky-700 font-bold text-sm">NER Coverage</span>
                <MapPin className="w-5 h-5 text-sky-600/60" />
              </div>
              <p className="text-3xl font-black text-slate-900">8</p>
              <p className="text-xs text-slate-600 mt-2">Districts monitored</p>
            </div>
          </div>
        </div>

        {/* Two-Column Layout with Balanced Content Flow */}
        <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          
          {/* Left Column - Form (takes remaining space) */}
          <div className="lg:col-span-1 xl:col-span-2 order-2 lg:order-1">
            <CitizenReportForm districts={districts} onSuccess={loadDistricts} />
          </div>

          {/* Right Column - Info Grid (6 cards in responsive grid) */}
          <div className="lg:col-span-2 xl:col-span-2 order-1 lg:order-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 auto-rows-max">
              
              {/* Why Report Matters - Emerald */}
              <div className="relative group p-6 rounded-2xl bg-emerald-50 border-2 border-emerald-200 shadow-md hover:shadow-xl hover:border-emerald-400 hover:scale-105 transition-all duration-300 cursor-pointer">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 rounded-lg bg-emerald-100 text-emerald-700 group-hover:bg-emerald-200 transition-colors duration-300">
                    <Zap className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <h3 className="font-heading text-base font-bold text-slate-900">Why Your Report Matters</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex gap-3">
                    <span className="text-emerald-600 font-bold text-lg mt-0.5">✓</span>
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">Save 50+ Lives</p>
                      <p className="text-slate-600 text-xs">Auto-alerts to agencies</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-emerald-600 font-bold text-lg mt-0.5">✓</span>
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">Prevent Accidents</p>
                      <p className="text-slate-600 text-xs">Road warnings sent</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-emerald-600 font-bold text-lg mt-0.5">✓</span>
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">Works Offline</p>
                      <p className="text-slate-600 text-xs">Sync when connected</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-emerald-600 font-bold text-lg mt-0.5">✓</span>
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">AI Verified</p>
                      <p className="text-slate-600 text-xs">Auto-checked photos</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Photo Checklist - Blue */}
              <div className="p-6 rounded-2xl bg-sky-50 border-2 border-sky-200 shadow-md hover:shadow-xl hover:border-sky-400 hover:scale-105 transition-all duration-300 cursor-pointer group">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 rounded-lg bg-sky-100 text-sky-700 group-hover:bg-sky-200 transition-colors duration-300">
                    <Camera className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <h3 className="font-heading text-base font-bold text-slate-900">Photo Tips</h3>
                </div>
                <div className="space-y-2.5 text-sm">
                  <p className="flex gap-3"><span className="text-sky-600 font-bold flex-shrink-0">1.</span><span className="text-slate-700">Hazard in frame</span></p>
                  <p className="flex gap-3"><span className="text-sky-600 font-bold flex-shrink-0">2.</span><span className="text-slate-700">Context visible</span></p>
                  <p className="flex gap-3"><span className="text-sky-600 font-bold flex-shrink-0">3.</span><span className="text-slate-700">GPS enabled</span></p>
                  <p className="flex gap-3"><span className="text-sky-600 font-bold flex-shrink-0">4.</span><span className="text-slate-700">Daytime photo</span></p>
                  <p className="flex gap-3"><span className="text-sky-600 font-bold flex-shrink-0">5.</span><span className="text-slate-700">Landscape mode</span></p>
                </div>
              </div>

              {/* Severity Guide - Red */}
              <div className="p-6 rounded-2xl bg-red-50 border-2 border-red-200 shadow-md hover:shadow-xl hover:border-red-400 hover:scale-105 transition-all duration-300 cursor-pointer group">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 rounded-lg bg-red-100 text-red-700 group-hover:bg-red-200 transition-colors duration-300">
                    <AlertTriangle className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <h3 className="font-heading text-base font-bold text-slate-900">Severity Levels</h3>
                </div>
                <div className="space-y-2.5 text-sm">
                  <p><span className="text-red-600 font-bold">🔴 Catastrophic:</span> <span className="text-slate-700">Massive damage</span></p>
                  <p><span className="text-orange-600 font-bold">🟠 Severe:</span> <span className="text-slate-700">Road blocked</span></p>
                  <p><span className="text-amber-600 font-bold">🟡 Moderate:</span> <span className="text-slate-700">Partial block</span></p>
                  <p><span className="text-slate-600 font-bold">⚪ Minor:</span> <span className="text-slate-700">Small slips</span></p>
                </div>
              </div>

              {/* Response Timeline - Purple */}
              <div className="p-6 rounded-2xl bg-purple-50 border-2 border-purple-200 shadow-md hover:shadow-xl hover:border-purple-400 hover:scale-105 transition-all duration-300 cursor-pointer group">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 rounded-lg bg-purple-100 text-purple-700 group-hover:bg-purple-200 transition-colors duration-300">
                    <Clock className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <h3 className="font-heading text-base font-bold text-slate-900">Response Timeline</h3>
                </div>
                <div className="space-y-2.5 text-sm">
                  <p><span className="text-purple-600 font-bold">⚡ 5s:</span> <span className="text-slate-700">Report submitted</span></p>
                  <p><span className="text-purple-600 font-bold">⏱️ 30s:</span> <span className="text-slate-700">AI verifies image</span></p>
                  <p><span className="text-purple-600 font-bold">📡 1m:</span> <span className="text-slate-700">Alert generated</span></p>
                  <p><span className="text-purple-600 font-bold">🚨 2m:</span> <span className="text-slate-700">Agencies notified</span></p>
                </div>
              </div>

              {/* Security - Cyan */}
              <div className="p-6 rounded-2xl bg-cyan-50 border-2 border-cyan-200 shadow-md hover:shadow-xl hover:border-cyan-400 hover:scale-105 transition-all duration-300 cursor-pointer group">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 rounded-lg bg-cyan-100 text-cyan-700 group-hover:bg-cyan-200 transition-colors duration-300">
                    <Shield className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <h3 className="font-heading text-base font-bold text-slate-900">Security</h3>
                </div>
                <div className="space-y-2.5 text-sm">
                  <p className="flex gap-2"><span className="text-cyan-600 font-bold">✓</span><span className="text-slate-700">End-to-end encrypted</span></p>
                  <p className="flex gap-2"><span className="text-cyan-600 font-bold">✓</span><span className="text-slate-700">Private identity</span></p>
                  <p className="flex gap-2"><span className="text-cyan-600 font-bold">✓</span><span className="text-slate-700">NDMA only access</span></p>
                  <p className="flex gap-2"><span className="text-cyan-600 font-bold">✓</span><span className="text-slate-700">Research retention</span></p>
                </div>
              </div>

              {/* Emergency - Amber */}
              <div className="p-6 rounded-2xl bg-amber-50 border-2 border-amber-200 shadow-md hover:shadow-xl hover:border-amber-400 hover:scale-105 transition-all duration-300 cursor-pointer group">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 rounded-lg bg-amber-100 text-amber-700 group-hover:bg-amber-200 transition-colors duration-300">
                    <PhoneCall className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <h3 className="font-heading text-base font-bold text-slate-900">Emergency Contacts</h3>
                </div>
                <div className="space-y-2.5 text-sm">
                  <div>
                    <p className="text-slate-600 text-xs font-semibold">National Helpline</p>
                    <p className="font-bold text-amber-700 text-lg">📞 1077</p>
                  </div>
                  <div className="border-t border-amber-100 pt-2">
                    <p className="text-slate-600 text-xs font-semibold">NDMA SMS Alert</p>
                    <p className="text-slate-700 text-sm">All registered users</p>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
