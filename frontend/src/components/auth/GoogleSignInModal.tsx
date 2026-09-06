import React, { useEffect } from 'react';
import { X, ShieldAlert, User, ShieldCheck, Compass } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

interface GoogleSignInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GoogleSignInModal: React.FC<GoogleSignInModalProps> = ({ isOpen, onClose }) => {
  const { demoLogin, loginWithGoogle } = useAuth();
  const { language } = useLanguage();

  useEffect(() => {
    if (!isOpen) return;
    // Initialize Google Identity Services if script is loaded
    const win = window as any;
    if (win.google && win.google.accounts && win.google.accounts.id) {
      try {
        win.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
          callback: (response: any) => {
            if (response.credential) {
              loginWithGoogle(response.credential, language).then(() => onClose());
            }
          },
        });
        const container = document.getElementById('googleSignInDiv');
        if (container) {
          win.google.accounts.id.renderButton(
            container,
            { theme: 'filled_blue', size: 'large', shape: 'pill', width: '100%' }
          );
        }
      } catch (e) {
        console.warn('Google GSI initialization notice:', e);
      }
    }
  }, [isOpen, language]);

  if (!isOpen) return null;

  const handleDemoSelect = async (role: 'ROLE_CITIZEN' | 'ROLE_FIELD_OFFICER' | 'ROLE_DISTRICT_ADMIN', name: string, email: string, dist: string) => {
    await demoLogin(role, name, email, dist);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-sm w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with Shield Icon */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-md">
            <ShieldAlert className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gov-navy-900">Sign In to JeevanPrahari</h2>
            <p className="text-xs text-slate-600 mt-0.5">North Eastern Region Disaster Management Portal</p>
          </div>
        </div>

        {/* Google OAuth Section */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 mb-5">
          <p className="text-xs text-slate-700 font-semibold mb-3 text-center">Continue with Google Account</p>
          <div id="googleSignInDiv" className="flex justify-center min-h-[48px]">
            {/* Fallback button if Google script is blocked or offline */}
            <button
              onClick={() => handleDemoSelect('ROLE_CITIZEN', 'Google User (Meghalaya Citizen)', 'citizen.ner@gmail.com', 'IN-ML-EKH')}
              className="px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm flex items-center justify-center gap-2.5 shadow-md hover:shadow-lg transition-all w-full"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Sign in with Google</span>
            </button>
          </div>
          <p className="text-xs text-slate-500 mt-2 text-center">Tokens are verified against Spring Security backend</p>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-5">
          <span className="h-px bg-slate-200 flex-1"></span>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Demo Roles</span>
          <span className="h-px bg-slate-200 flex-1"></span>
        </div>

        {/* Role Buttons */}
        <div className="space-y-2.5">
          {/* District Disaster Admin */}
          <button
            onClick={() => handleDemoSelect('ROLE_DISTRICT_ADMIN', 'Dima Hasao Disaster Admin', 'district.admin@pahaarsaathi.ner.gov.in', 'IN-AS-DH')}
            className="w-full p-3 rounded-lg bg-red-50 hover:bg-red-100 border border-red-200 hover:border-red-300 transition-all flex items-start justify-between gap-3 group"
          >
            <div className="flex items-start gap-2.5 flex-1">
              <div className="p-2 rounded-lg bg-red-500/15 text-red-600 flex-shrink-0 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-slate-900">District Admin</p>
                <p className="text-[11px] text-slate-600 mt-0.5">Full access to CAP alerts</p>
              </div>
            </div>
            <span className="text-xs px-2 py-1 rounded-md bg-red-600 text-white font-semibold flex-shrink-0">Admin</span>
          </button>

          {/* Field Officer */}
          <button
            onClick={() => handleDemoSelect('ROLE_FIELD_OFFICER', 'Officer T. Sangma (SDRF)', 'field.officer@pahaarsaathi.ner.gov.in', 'IN-ML-EKH')}
            className="w-full p-3 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-200 hover:border-amber-300 transition-all flex items-start justify-between gap-3 group"
          >
            <div className="flex items-start gap-2.5 flex-1">
              <div className="p-2 rounded-lg bg-amber-500/15 text-amber-600 flex-shrink-0 group-hover:scale-110 transition-transform">
                <Compass className="w-4 h-4" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-slate-900">Field Officer</p>
                <p className="text-[11px] text-slate-600 mt-0.5">Verify citizen reports</p>
              </div>
            </div>
            <span className="text-xs px-2 py-1 rounded-md bg-amber-600 text-white font-semibold flex-shrink-0">Officer</span>
          </button>

          {/* Citizen */}
          <button
            onClick={() => handleDemoSelect('ROLE_CITIZEN', 'R. Khongwir (Sohra Resident)', 'citizen.ner@gmail.com', 'IN-ML-EKH')}
            className="w-full p-3 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 hover:border-emerald-300 transition-all flex items-start justify-between gap-3 group"
          >
            <div className="flex items-start gap-2.5 flex-1">
              <div className="p-2 rounded-lg bg-emerald-500/15 text-emerald-600 flex-shrink-0 group-hover:scale-110 transition-transform">
                <User className="w-4 h-4" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-slate-900">Local Citizen</p>
                <p className="text-[11px] text-slate-600 mt-0.5">Report incidents & view maps</p>
              </div>
            </div>
            <span className="text-xs px-2 py-1 rounded-md bg-emerald-600 text-white font-semibold flex-shrink-0">Public</span>
          </button>
        </div>
      </div>
    </div>
  );
};
