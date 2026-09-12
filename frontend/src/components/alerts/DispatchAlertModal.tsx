import React, { useState, useEffect } from 'react';
import { District, AlertTemplate } from '../../types';
import { api } from '../../services/api';
import { X, BellRing, Send, Globe, Radio, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface DispatchAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAlertDispatched: () => void;
  districts: District[];
  defaultDistrictId?: string;
}

export const DispatchAlertModal: React.FC<DispatchAlertModalProps> = ({
  isOpen,
  onClose,
  onAlertDispatched,
  districts,
  defaultDistrictId = 'IN-ML-EKH',
}) => {
  const { languages } = useLanguage();

  const [districtId, setDistrictId] = useState<string>(defaultDistrictId);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en');
  const [templateCode, setTemplateCode] = useState<string>('LANDSLIDE_RED_ALERT');
  const [templates, setTemplates] = useState<AlertTemplate[]>([]);

  const [headline, setHeadline] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [instruction, setInstruction] = useState<string>('');
  const [severity, setSeverity] = useState<string>('Severe');
  const [urgency, setUrgency] = useState<string>('Immediate');
  const [channels, setChannels] = useState<string[]>(['SMS', 'PUSH', 'IN_APP']);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Load templates when language changes
  useEffect(() => {
    async function loadTemplates() {
      try {
        const list = await api.alerts.getTemplates(selectedLanguage);
        setTemplates(list);
        if (list.length > 0) {
          const match = list.find((t) => t.templateCode === templateCode) || list[0];
          setHeadline(match.headline);
          setDescription(match.body);
          setInstruction(match.instruction);
          setSeverity(match.severity);
        }
      } catch (e) {
        console.warn('Could not load templates:', e);
      }
    }
    if (isOpen) {
      loadTemplates();
    }
  }, [selectedLanguage, isOpen]);

  const handleTemplateChange = (code: string) => {
    setTemplateCode(code);
    const match = templates.find((t) => t.templateCode === code);
    if (match) {
      setHeadline(match.headline);
      setDescription(match.body);
      setInstruction(match.instruction);
      setSeverity(match.severity);
    }
  };

  const handleChannelToggle = (ch: string) => {
    if (channels.includes(ch)) {
      setChannels(channels.filter((c) => c !== ch));
    } else {
      setChannels([...channels, ch]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.alerts.dispatch({
        districtId,
        headline,
        description,
        instruction,
        severity,
        urgency,
        language: selectedLanguage,
        templateCode,
        channels,
        affectedAreaName: districts.find((d) => d.id === districtId)?.name || districtId,
      });

      setSuccessMsg('NDMA CAP 1.2 Alert successfully broadcasted across SMS, Push, and Web channels.');
      setTimeout(() => {
        setSuccessMsg(null);
        onAlertDispatched();
        onClose();
      }, 1800);
    } catch (e: any) {
      alert('Failed to dispatch alert: ' + e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-md animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative text-slate-900 max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-red-50 rounded-xl text-red-600 border border-red-300">
            <Radio className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="font-heading text-xl font-bold text-slate-900">Broadcast NDMA CAP Alert</h3>
            <p className="text-xs text-slate-600">Multi-Channel Hazard Warning Dispatch for District Command</p>
          </div>
        </div>

        {successMsg ? (
          <div className="p-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
            <h4 className="font-heading text-lg font-bold text-slate-900">{successMsg}</h4>
            <p className="text-xs text-slate-600">Broadcasting to community phones and local emergency networks...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Target District & Language */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Target District</label>
                <select
                  value={districtId}
                  onChange={(e) => setDistrictId(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:ring-1 focus:ring-emerald-500 shadow-sm"
                >
                  {districts.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.state})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-emerald-600" /> Alert Language (Pre-translated)
                </label>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:ring-1 focus:ring-emerald-500 shadow-sm"
                >
                  {languages.map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Template Selector */}
            {templates.length > 0 && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Standard Safety Template
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {templates.map((t) => (
                    <button
                      type="button"
                      key={t.templateCode}
                      onClick={() => handleTemplateChange(t.templateCode)}
                      className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                        templateCode === t.templateCode
                          ? 'bg-red-100 border-red-400 text-slate-900 font-bold shadow-sm'
                          : 'bg-slate-50 border-slate-300 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span className="block truncate">{t.templateCode.replace(/_/g, ' ')}</span>
                      <span className="text-[10px] text-slate-600 block">{t.severity}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Headline */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Alert Headline</label>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                required
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-900 focus:ring-1 focus:ring-emerald-500 shadow-sm"
                placeholder="e.g. CRITICAL: Landslide Hazard Warning for East Khasi Hills"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Hazard Description</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-700 focus:ring-1 focus:ring-emerald-500 shadow-sm"
                placeholder="Details of rainfall intensity, pore saturation, and active slope movements..."
              />
            </div>

            {/* Public Instruction */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Citizen & Evacuation Instruction</label>
              <textarea
                rows={2}
                value={instruction}
                onChange={(e) => setInstruction(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-emerald-700 focus:ring-1 focus:ring-emerald-500 shadow-sm"
                placeholder="Evacuation shelter directions, mountain highway diversions, emergency phone numbers..."
              />
            </div>

            {/* Channel Checkboxes & Severity */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-200">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Dispatch Channels</label>
                <div className="flex items-center gap-3 text-xs">
                  {['SMS', 'PUSH', 'IN_APP'].map((ch) => (
                    <label key={ch} className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={channels.includes(ch)}
                        onChange={() => handleChannelToggle(ch)}
                        className="rounded border-slate-300 text-emerald-600 bg-white"
                      />
                      <span className="font-medium text-slate-700">{ch}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">CAP Severity</label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-900 shadow-sm"
                >
                  <option value="Extreme">Extreme (Red Alert)</option>
                  <option value="Severe">Severe (Orange Warning)</option>
                  <option value="Moderate">Moderate (Yellow Watch)</option>
                  <option value="Minor">Minor (Advisory)</option>
                </select>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-900 text-xs font-semibold shadow-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-red-600/30 transition-all disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Dispatching...' : 'Broadcast Alert'}</span>
              </button>
            </div>

          </form>
        )}
      </div>
    </div>
  );
};
