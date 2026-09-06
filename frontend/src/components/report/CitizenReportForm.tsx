import React, { useState, useEffect } from 'react';
import { Camera, MapPin, AlertTriangle, ShieldCheck, CheckCircle2, Upload, WifiOff, RefreshCw } from 'lucide-react';
import { useOffline } from '../../context/OfflineContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../services/api';
import { District } from '../../types';

interface CitizenReportFormProps {
  districts?: District[];
  onSuccess?: () => void;
}

export const CitizenReportForm: React.FC<CitizenReportFormProps> = ({ districts = [], onSuccess }) => {
  const { isOnline, queueOfflineReport } = useOffline();
  const { user, isAuthenticated } = useAuth();
  const { t } = useLanguage();

  const [latitude, setLatitude] = useState<number>(25.5788);
  const [longitude, setLongitude] = useState<number>(91.8933);
  const [locating, setLocating] = useState<boolean>(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const [districtId, setDistrictId] = useState<string>('IN-ML-EKH');
  const [locationDescription, setLocationDescription] = useState<string>('');
  const [landslideType, setLandslideType] = useState<string>('SOIL_SLIDE');
  const [severity, setSeverity] = useState<string>('MODERATE');
  const [description, setDescription] = useState<string>('');
  const [reporterName, setReporterName] = useState<string>(user?.name || '');
  const [reporterPhone, setReporterPhone] = useState<string>(user?.phoneNumber || '');
  const [roadBlocked, setRoadBlocked] = useState<boolean>(false);
  const [casualties, setCasualties] = useState<number>(0);

  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Auto GPS location fetch on mount
  useEffect(() => {
    fetchGPS();
  }, []);

  const fetchGPS = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation not supported by device');
      return;
    }
    setLocating(true);
    setLocationError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitude(Math.round(pos.coords.latitude * 10000) / 10000);
        setLongitude(Math.round(pos.coords.longitude * 10000) / 10000);
        setLocating(false);
      },
      (err) => {
        setLocationError('Could not get live GPS location. Using default district center.');
        setLocating(false);
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setMediaFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setMediaPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const offlineSyncId = 'REP-' + Date.now() + '-' + Math.floor(Math.random() * 10000);

    try {
      if (!isOnline) {
        // Queue report in IndexedDB
        await queueOfflineReport({
          offlineSyncId,
          latitude,
          longitude,
          locationDescription: locationDescription || 'Mountain sector near GPS coordinates',
          districtId,
          landslideType,
          severity,
          description,
          reporterName: reporterName || (isAuthenticated ? user?.name || 'Citizen' : 'Anonymous Citizen'),
          reporterPhone,
          reporterRole: user?.role ? user.role.replace('ROLE_', '') : 'CITIZEN',
          mediaBase64: mediaPreview || undefined,
          roadBlocked,
          casualtiesReported: casualties,
          createdAt: new Date().toISOString(),
        });

        setSuccessMessage('Report saved offline in local storage! It will automatically sync as soon as you regain network.');
      } else {
        // Online Submission
        let mediaUrl = undefined;
        if (mediaFile) {
          try {
            const uploadRes = await api.reports.uploadMedia(mediaFile);
            mediaUrl = uploadRes.mediaUrl;
          } catch (e) {
            console.warn('Media upload fallback to base64 preview');
            mediaUrl = mediaPreview || undefined;
          }
        }

        await api.reports.submit({
          latitude,
          longitude,
          locationDescription: locationDescription || 'Mountain sector near GPS coordinates',
          districtId,
          landslideType: landslideType as any,
          severity: severity as any,
          description,
          reporterName: reporterName || (isAuthenticated ? user?.name || 'Citizen' : 'Anonymous Citizen'),
          reporterPhone,
          reporterRole: user?.role ? user.role.replace('ROLE_', '') : 'CITIZEN',
          mediaUrl,
          offlineSyncId,
          roadBlocked,
          casualtiesReported: casualties,
        });

        setSuccessMessage('Landslide incident report submitted successfully to district disaster cell!');
      }

      setTimeout(() => {
        setSuccessMessage(null);
        if (onSuccess) onSuccess();
        // Reset form
        setDescription('');
        setLocationDescription('');
        setMediaFile(null);
        setMediaPreview(null);
      }, 2500);
    } catch (err: any) {
      alert('Error submitting report: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6 text-white">
      
      {/* Form Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/30">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-heading text-xl font-bold text-white">Report a Landslide / Hazard</h3>
            <p className="text-xs text-slate-400">Crowd-sourced field intelligence for North East India (PWA Enabled)</p>
          </div>
        </div>

        {!isOnline && (
          <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-bold flex items-center gap-1">
            <WifiOff className="w-3 h-3" /> Offline Mode
          </span>
        )}
      </div>

      {successMessage ? (
        <div className="p-8 text-center space-y-3 animate-fade-in">
          <CheckCircle2 className="w-14 h-14 text-emerald-400 mx-auto" />
          <h4 className="font-heading text-lg font-bold text-white">{successMessage}</h4>
          <p className="text-xs text-slate-400">Thank you for helping keep North Eastern communities safe.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* GPS Auto-tag Location */}
          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-400" /> GPS Geotag
              </span>
              <button
                type="button"
                onClick={fetchGPS}
                disabled={locating}
                className="text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
              >
                <RefreshCw className={`w-3 h-3 ${locating ? 'animate-spin' : ''}`} />
                <span>{locating ? 'Acquiring GPS...' : 'Refresh GPS'}</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Latitude (°N)</label>
                <input
                  type="number"
                  step="0.0001"
                  value={latitude}
                  onChange={(e) => setLatitude(parseFloat(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 font-mono text-xs text-white"
                  required
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Longitude (°E)</label>
                <input
                  type="number"
                  step="0.0001"
                  value={longitude}
                  onChange={(e) => setLongitude(parseFloat(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 font-mono text-xs text-white"
                  required
                />
              </div>
            </div>
            {locationError && (
              <p className="text-[10px] text-amber-400">{locationError}</p>
            )}
          </div>

          {/* District & Location Description */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">District</label>
              <select
                value={districtId}
                onChange={(e) => setDistrictId(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-medium"
              >
                {districts.length > 0 ? (
                  districts.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))
                ) : (
                  <>
                    <option value="IN-ML-EKH">East Khasi Hills (Shillong)</option>
                    <option value="IN-AS-DH">Dima Hasao (Haflong)</option>
                    <option value="IN-SK-GTK">Gangtok (Sikkim)</option>
                    <option value="IN-MZ-CHM">Champhai (Mizoram)</option>
                  </>
                )}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Landmark / Road Km</label>
              <input
                type="text"
                value={locationDescription}
                onChange={(e) => setLocationDescription(e.target.value)}
                placeholder="e.g. NH-6 near Mawryngkneng km 34"
                required
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white"
              />
            </div>
          </div>

          {/* Landslide Type & Severity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">{t.selectType}</label>
              <select
                value={landslideType}
                onChange={(e) => setLandslideType(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
              >
                <option value="SOIL_SLIDE">Soil Slide / Mudslide</option>
                <option value="DEBRIS_FLOW">Debris Flow / Torrent</option>
                <option value="ROCKFALL">Rockfall / Falling Boulders</option>
                <option value="ROAD_SUBSIDENCE">Road Subsidence / Sinking</option>
                <option value="TENSION_CRACK">Ground Tension Cracks (Slope Creep)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">{t.selectSeverity}</label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-bold"
              >
                <option value="MINOR">Minor (Small slips, traffic slow)</option>
                <option value="MODERATE">Moderate (Partial road blockage)</option>
                <option value="SEVERE">Severe (Full road blocked, structures in danger)</option>
                <option value="CATASTROPHIC">Catastrophic (Settlement damage / massive debris flow)</option>
              </select>
            </div>
          </div>

          {/* Details / Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Observations & Remarks</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe slope movement, water flow, danger to nearby houses, trapped vehicles..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-200"
            />
          </div>

          {/* Road Blockage & Casualties */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3.5 rounded-xl bg-slate-800/40 border border-slate-750">
            <label className="flex items-center gap-2 cursor-pointer text-xs">
              <input
                type="checkbox"
                checked={roadBlocked}
                onChange={(e) => setRoadBlocked(e.target.checked)}
                className="rounded border-slate-700 text-red-500 bg-slate-900 w-4 h-4"
              />
              <span className="font-semibold text-slate-200">Mountain Road / Highway is Completely Blocked</span>
            </label>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300">Casualties Reported:</span>
              <input
                type="number"
                min="0"
                value={casualties}
                onChange={(e) => setCasualties(parseInt(e.target.value) || 0)}
                className="w-16 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-center font-bold text-white text-xs"
              />
            </div>
          </div>

          {/* Camera / Photo Upload */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-emerald-400" /> Photo / Video Evidence (MinIO Storage)
            </label>
            
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <label className="w-full sm:w-auto px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 border-dashed text-xs text-slate-300 font-semibold cursor-pointer flex items-center justify-center gap-2 transition-colors">
                <Upload className="w-4 h-4 text-emerald-400" />
                <span>Choose File or Capture</span>
                <input
                  type="file"
                  accept="image/*,video/*"
                  capture="environment"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>

              {mediaPreview && (
                <div className="relative">
                  <img
                    src={mediaPreview}
                    alt="Preview"
                    className="w-20 h-20 object-cover rounded-xl border border-slate-700 shadow-md"
                  />
                  <button
                    type="button"
                    onClick={() => { setMediaFile(null); setMediaPreview(null); }}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-600 text-white text-[10px] flex items-center justify-center"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Reporter Contact Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Reporter Name</label>
              <input
                type="text"
                value={reporterName}
                onChange={(e) => setReporterName(e.target.value)}
                placeholder="Your Name"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Contact Phone Number</label>
              <input
                type="tel"
                value={reporterPhone}
                onChange={(e) => setReporterPhone(e.target.value)}
                placeholder="+91 9XXXXXXXXX"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-sm shadow-xl shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <ShieldCheck className="w-5 h-5" />
            <span>{submitting ? 'Submitting Report...' : t.submitReport}</span>
          </button>

        </form>
      )}
    </div>
  );
};
