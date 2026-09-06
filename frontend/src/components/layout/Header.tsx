import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ShieldAlert,
  MapPin,
  AlertTriangle,
  PhoneCall,
  Globe,
  Moon,
  Sun,
  Menu,
  X,
  User,
  LogOut,
  Sliders,
  BarChart3,
  FileText,
  Radio
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { GoogleSignInModal } from '../auth/GoogleSignInModal';

export const Header: React.FC = () => {
  const { user, isAuthenticated, logout, hasRole } = useAuth();
  const { language, setLanguage, languages, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHelplineModalOpen, setIsHelplineModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [activeNavHover, setActiveNavHover] = useState<string | null>(null);

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-gradient-to-b from-slate-950/95 via-slate-950/90 to-slate-950/80 backdrop-blur-xl border-b border-slate-800/50 shadow-2xl shadow-black/50 transition-all duration-300">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">

            {/* Left: Brand Logo & Wordmark */}
            <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
              <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <ShieldAlert className="w-5 h-5 text-white" />
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
              </div>
              <span className="font-heading text-xl sm:text-2xl font-extrabold tracking-tight text-white flex items-center gap-1.5">
                PahaarSaathi
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  NER-LEWS
                </span>
              </span>
            </Link>

            {/* Center: Desktop Nav Links */}
            <nav className="hidden lg:flex items-center gap-0.5 flex-1 justify-center px-4">
              {[
                { path: '/', label: t.navHome, icon: null },
                { path: '/map', label: t.navRiskMap, icon: null },
                { path: '/report', label: t.navReport, icon: null },
                { path: '/alerts', label: t.navAlerts, icon: null },
                ...(isAuthenticated && hasRole(['ROLE_DISTRICT_ADMIN', 'ROLE_SUPER_ADMIN', 'ROLE_FIELD_OFFICER']) 
                  ? [{ path: '/dashboard', label: t.navDashboard, icon: Sliders }]
                  : []),
                { path: '/model-insights', label: t.navModelInsights, icon: BarChart3 },
                { path: '/about', label: t.navAbout, icon: null },
              ].map((navItem) => (
                <Link
                  key={navItem.path}
                  to={navItem.path}
                  onMouseEnter={() => setActiveNavHover(navItem.path)}
                  onMouseLeave={() => setActiveNavHover(null)}
                  className={`relative px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center gap-2 group whitespace-nowrap ${
                    isActive(navItem.path)
                      ? 'text-white'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {/* Glossy Background on Hover */}
                  <div
                    className={`absolute inset-0 rounded-xl -z-10 transition-all duration-300 ${
                      isActive(navItem.path)
                        ? 'bg-gradient-to-r from-emerald-500/30 via-emerald-400/20 to-transparent opacity-100 shadow-lg shadow-emerald-500/30 border border-emerald-500/40'
                        : activeNavHover === navItem.path
                        ? 'bg-gradient-to-r from-emerald-500/20 via-emerald-400/10 to-transparent opacity-100 shadow-lg shadow-emerald-500/20'
                        : 'bg-transparent opacity-0 shadow-none'
                    }`}
                  />
                  
                  {/* Icon if present */}
                  {navItem.icon && <navItem.icon className={`w-4 h-4 transition-all duration-300 ${isActive(navItem.path) ? 'text-emerald-400' : 'text-slate-400 group-hover:text-emerald-400'}`} />}
                  
                  {/* Text */}
                  <span className="relative z-10">{navItem.label}</span>
                  
                  {/* Active Indicator Line */}
                  {isActive(navItem.path) && (
                    <div className="absolute bottom-0 left-5 right-5 h-1 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 rounded-full" />
                  )}
                </Link>
              ))}
            </nav>

            {/* Right: Emergency Helpline, Language, Theme, Auth */}
            <div className="hidden sm:flex items-center gap-4 flex-shrink-0">

              {/* Emergency Helpline Glossy Pill */}
              <button
                onClick={() => setIsHelplineModalOpen(true)}
                className="relative group px-5 py-2.5 rounded-full text-xs font-bold text-white overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95"
                title="State & District Disaster Control Room"
              >
                {/* Glossy gradient background */}
                <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-red-500 to-orange-600 rounded-full opacity-90 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Glossy shine overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Border glow */}
                <div className="absolute inset-0 rounded-full border border-red-400/60 group-hover:border-red-300/80 transition-colors duration-300 shadow-lg shadow-red-600/40 group-hover:shadow-red-500/50" />
                
                {/* Content */}
                <div className="relative flex items-center gap-2 z-10 whitespace-nowrap">
                  <PhoneCall className="w-4 h-4 animate-bounce flex-shrink-0" />
                  <span>1077</span>
                </div>
              </button>

              {/* Language Selector - Glossy */}
              <div className="relative group">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="relative z-10 bg-gradient-to-br from-slate-800 to-slate-900 text-slate-200 text-xs rounded-xl border border-slate-700/60 px-4 py-2.5 pr-9 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 appearance-none cursor-pointer transition-all duration-300 hover:border-slate-600 hover:shadow-lg hover:shadow-emerald-500/10 font-medium"
                >
                  {languages.map((l) => (
                    <option key={l.code} value={l.code} className="bg-slate-900 text-white">
                      {l.label}
                    </option>
                  ))}
                </select>
                
                {/* Glossy shine overlay for select */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-transparent via-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                
                <Globe className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none group-hover:text-slate-300 transition-colors" />
              </div>

              {/* Dark/Light Mode Toggle - Glossy */}
              <button
                onClick={toggleTheme}
                className="relative group p-2.5 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/60 text-slate-400 hover:text-slate-200 transition-all duration-300 hover:border-slate-600 hover:shadow-lg hover:shadow-emerald-500/10"
                aria-label="Toggle Theme"
              >
                {/* Glossy shine overlay */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-transparent via-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                
                <div className="relative z-10 transition-transform duration-300 group-hover:scale-110">
                  {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </div>
              </button>

              {/* Auth / Profile Area - Glossy */}
              {isAuthenticated && user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="relative group flex items-center gap-3 p-1.5 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/60 hover:border-emerald-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/20"
                  >
                    {/* Glossy shine overlay */}
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-transparent via-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    
                    <img
                      src={user.pictureUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                      alt={user.name}
                      className="relative z-10 w-8 h-8 rounded-lg object-cover border border-slate-600 group-hover:border-emerald-500/50 transition-colors duration-300"
                    />
                    <div className="text-left hidden xl:block pr-2 relative z-10">
                      <p className="text-xs font-semibold text-slate-200 leading-tight truncate max-w-[110px]">{user.name}</p>
                      <span className="text-[10px] text-emerald-400 block leading-tight">
                        {user.role.replace('ROLE_', '')}
                      </span>
                    </div>
                  </button>

                  {/* Dropdown Menu - Glossy */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-3 w-60 rounded-xl bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 border border-slate-700/60 shadow-2xl shadow-black/60 p-2 z-50 animate-fade-in backdrop-blur-xl">
                      <div className="px-3 py-3 border-b border-slate-800/60">
                        <p className="text-xs font-bold text-white truncate">{user.name}</p>
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">{user.email}</p>
                        <span className="inline-block mt-2 text-[10px] font-semibold px-2 py-1 rounded-lg bg-gradient-to-r from-emerald-500/20 to-teal-500/10 text-emerald-300 border border-emerald-500/30">
                          {user.role.replace('ROLE_', '')}
                        </span>
                      </div>
                      <div className="py-1 space-y-1">
                        <button
                          onClick={() => { setIsAuthModalOpen(true); setIsUserMenuOpen(false); }}
                          className="w-full text-left px-3 py-2.5 text-xs text-slate-300 hover:bg-slate-800/60 rounded-lg flex items-center gap-2.5 transition-all duration-200 hover:text-white"
                        >
                          <Sliders className="w-4 h-4 text-slate-500" /> Switch Demo Role
                        </button>
                        <button
                          onClick={() => { logout(); setIsUserMenuOpen(false); }}
                          className="w-full text-left px-3 py-2.5 text-xs text-red-400 hover:bg-red-500/10 rounded-lg flex items-center gap-2.5 transition-all duration-200 hover:text-red-300"
                        >
                          <LogOut className="w-4 h-4" /> {t.signOut}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="relative group flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95 whitespace-nowrap"
                >
                  {/* Glossy gradient background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 rounded-xl opacity-90 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Glossy shine overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/15 to-white/25 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Border glow */}
                  <div className="absolute inset-0 rounded-xl border border-emerald-400/60 group-hover:border-emerald-300/80 transition-colors duration-300 shadow-lg shadow-emerald-600/40 group-hover:shadow-emerald-500/50" />
                  
                  {/* Content */}
                  <div className="relative z-10 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{t.signIn}</span>
                  </div>
                </button>
              )}
            </div>

            {/* Mobile Hamburger / Quick Helpline Button */}
            <div className="flex sm:hidden items-center gap-2">
              <button
                onClick={() => setIsHelplineModalOpen(true)}
                className="relative group p-2.5 rounded-lg bg-gradient-to-br from-red-600 to-red-700 text-white overflow-hidden transition-all duration-300 hover:scale-110 active:scale-95 shadow-lg shadow-red-600/40"
                title="Emergency"
              >
                {/* Glossy shine overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-white/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <PhoneCall className="w-5 h-5 relative z-10 animate-bounce" />
              </button>
              
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="relative group p-2.5 rounded-lg bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/60 text-slate-300 hover:text-white transition-all duration-300"
                aria-label="Open Navigation Menu"
              >
                {/* Glossy shine overlay */}
                <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-transparent via-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                
                <div className="relative z-10">
                  {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Bottom-Sheet / Drawer Menu */}
        {isMobileMenuOpen && (
          <div className="sm:hidden border-t border-slate-800/60 bg-gradient-to-b from-slate-950/95 via-slate-950/90 to-slate-950 backdrop-blur-xl px-4 pt-4 pb-6 space-y-2 animate-fade-in">
            {[
              { path: '/', label: t.navHome },
              { path: '/map', label: t.navRiskMap },
              { path: '/report', label: t.navReport },
              { path: '/alerts', label: t.navAlerts },
              ...(isAuthenticated && hasRole(['ROLE_DISTRICT_ADMIN', 'ROLE_SUPER_ADMIN', 'ROLE_FIELD_OFFICER'])
                ? [{ path: '/dashboard', label: t.navDashboard }]
                : []),
              { path: '/model-insights', label: t.navModelInsights },
              { path: '/about', label: t.navAbout },
            ].map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  isActive(item.path)
                    ? 'text-white bg-gradient-to-r from-emerald-500/30 via-emerald-400/20 to-transparent border border-emerald-500/40 shadow-lg shadow-emerald-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                {item.label}
              </Link>
            ))}

            {/* Language Selection in Mobile */}
            <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-semibold">Language:</span>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="relative z-10 bg-gradient-to-br from-slate-800 to-slate-900 text-white text-xs rounded-lg border border-slate-700/60 px-3 py-2 pr-7 focus:outline-none focus:ring-1 focus:ring-emerald-500 appearance-none cursor-pointer transition-all duration-300"
              >
                {languages.map((l) => (
                  <option key={l.code} value={l.code} className="bg-slate-900">
                    {l.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Auth in Mobile */}
            <div className="pt-3">
              {isAuthenticated && user ? (
                <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-br from-slate-800/60 to-slate-900/60 border border-slate-700/60 backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <img
                      src={user.pictureUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                      alt={user.name}
                      className="w-8 h-8 rounded-lg border border-slate-600"
                    />
                    <div>
                      <p className="text-xs font-bold text-white">{user.name}</p>
                      <p className="text-[10px] text-emerald-400">{user.role.replace('ROLE_', '')}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                    className="group relative p-2.5 rounded-lg hover:bg-red-500/10 transition-all duration-300"
                  >
                    <LogOut className="w-4 h-4 text-red-400 group-hover:text-red-300" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => { setIsAuthModalOpen(true); setIsMobileMenuOpen(false); }}
                  className="relative group w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2 overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg shadow-emerald-600/40"
                >
                  {/* Glossy shine overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="relative z-10 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {t.signIn}
                  </div>
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Emergency Helpline Modal */}
      {isHelplineModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-red-500/40 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setIsHelplineModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 text-red-500 mb-4">
              <div className="p-3 bg-red-500/10 rounded-xl border border-red-500/30">
                <PhoneCall className="w-6 h-6 animate-bounce" />
              </div>
              <div>
                <h3 className="font-heading text-lg font-bold text-white">Emergency Disaster Control</h3>
                <p className="text-xs text-slate-400">North Eastern Region Life-Safety Helplines</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-300">National Emergency Number</p>
                  <p className="text-lg font-bold text-emerald-400">112</p>
                </div>
                <a
                  href="tel:112"
                  className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-bold"
                >
                  Call 112
                </a>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-300">State Disaster Management Authority (SDMA)</p>
                  <p className="text-lg font-bold text-red-400">1070 / 1077</p>
                </div>
                <a
                  href="tel:1077"
                  className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold"
                >
                  Call 1077
                </a>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700 text-xs text-slate-400">
                <p className="font-semibold text-slate-300 mb-1">State Control Rooms:</p>
                <ul className="space-y-0.5">
                  <li>• Meghalaya SDMA (Shillong): 0364-2222277</li>
                  <li>• Assam SDMA (Haflong/Dispur): 1070 / 03673-236222</li>
                  <li>• Sikkim SDMA (Gangtok): 03592-202720</li>
                  <li>• Mizoram Disaster Control (Aizawl): 03831-234200</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Google Sign In & Demo Role Switcher Modal */}
      {isAuthModalOpen && (
        <GoogleSignInModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      )}
    </>
  );
};
