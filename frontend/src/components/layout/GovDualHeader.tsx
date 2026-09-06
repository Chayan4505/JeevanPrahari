import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import {
  Menu,
  X,
  Phone,
  Home,
  MapPin,
  AlertTriangle,
  BarChart3,
  FileText,
  HelpCircle,
  LogOut,
  User,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { GoogleSignInModal } from '../auth/GoogleSignInModal';
import { JeevanPrahariLogo } from './logo';

export const GovDualHeader: React.FC = () => {
  const { user, isAuthenticated, logout, hasRole } = useAuth();
  const { t } = useLanguage();
  const location = useLocation();
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/map', label: 'Risk Map', icon: MapPin },
    { path: '/report', label: 'Report Incident', icon: FileText },
    { path: '/alerts', label: 'CAP Alerts', icon: AlertTriangle },
    ...(isAuthenticated && hasRole(['ROLE_DISTRICT_ADMIN', 'ROLE_SUPER_ADMIN', 'ROLE_FIELD_OFFICER'])
      ? [{ path: '/dashboard', label: 'Analytics', icon: BarChart3 }]
      : []),
    { path: '/model-insights', label: 'Model Insights', icon: BarChart3 },
    { path: '/about', label: 'Help', icon: HelpCircle },
  ];

  return (
    <>
      {/* Main Government Branding Header */}
      <header className="w-full bg-white border-b border-slate-300 sticky top-0 z-30">
        <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Left: State Emblem & Title */}
            <Link to="/" className="flex items-center gap-4 flex-shrink-0 group no-underline">
              {/* Official Logo */}
              <div className="w-16 h-16 flex items-center justify-center group-hover:scale-105 transition-transform rounded-lg">
                <JeevanPrahariLogo className="w-14 h-14" />
              </div>

              {/* Brand Text */}
              <div className="hidden sm:flex flex-col gap-0.5 no-underline">
                <h1 className="text-sm sm:text-base font-bold text-gov-navy-900 tracking-tight no-underline">
                  JeevanPrahari: Landslide Early Warning System
                </h1>
                <p className="text-xs text-slate-600 font-medium no-underline">
                  North Eastern Region - LEWS | NDMA & North Eastern Council
                </p>
              </div>
            </Link>

            {/* Center: Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center px-6">
              {navItems.slice(0, 4).map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`relative px-4 py-2 rounded text-sm font-semibold transition-all duration-200 flex items-center gap-2 whitespace-nowrap group ${
                      isActive(item.path)
                        ? 'text-gov-navy-900 bg-slate-100'
                        : 'text-slate-700 hover:text-gov-navy-900 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                    {isActive(item.path) && (
                      <div className="absolute bottom-0 left-4 right-4 h-1 bg-gov-saffron-500 rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right: Emergency Contact & Auth */}
            <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
              {/* Emergency Contact Badge */}
              <a
                href="tel:1078"
                className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold text-xs transition-all duration-200"
                title="NDMA National Toll-Free Disaster Management Line"
              >
                <Phone className="w-4 h-4" />
                <span className="hidden md:inline">NDMA: 1078</span>
              </a>

              {/* Auth / Profile */}
              {isAuthenticated && user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-300 hover:border-slate-400 hover:bg-slate-50 transition-all"
                  >
                    <img
                      src={user.pictureUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                      alt={user.name}
                      className="w-7 h-7 rounded-full object-cover"
                    />
                    <span className="hidden sm:inline text-xs font-semibold text-slate-900">
                      {user.name.split(' ')[0]}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-slate-600 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg border border-slate-300 shadow-lg z-50 overflow-hidden">
                      <div className="px-4 py-3 border-b border-slate-200 bg-slate-50">
                        <p className="text-sm font-bold text-slate-900">{user.name}</p>
                        <p className="text-xs text-slate-600 mt-0.5">{user.email}</p>
                        <span className="inline-block mt-2 text-xs px-2 py-1 rounded-full bg-gov-navy-100 text-gov-navy-900 font-semibold">
                          {user.role.replace('ROLE_', '')}
                        </span>
                      </div>
                      <div className="py-2">
                        <button
                          onClick={() => {
                            logout();
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 flex items-center gap-2 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          {t.signOut}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg bg-gov-navy-900 hover:bg-gov-navy-700 text-white font-semibold text-xs transition-all duration-200"
                >
                  <User className="w-4 h-4" />
                  Sign In
                </button>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
                aria-label="Toggle navigation menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-300 bg-slate-50 px-4 py-3 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-4 py-2 rounded text-sm font-semibold transition-all ${
                    isActive(item.path)
                      ? 'bg-gov-navy-100 text-gov-navy-900'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                </Link>
              );
            })}

            {!isAuthenticated && (
              <button
                onClick={() => {
                  setIsAuthModalOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2 rounded text-sm font-semibold bg-gov-navy-900 text-white hover:bg-gov-navy-700 transition-all mt-2"
              >
                Sign In
              </button>
            )}
          </div>
        )}
      </header>

      {/* Primary Navigation Bar (Deep Navy) */}
      <nav className="hidden lg:block w-full bg-gov-navy-900 text-white border-b-4 border-gov-saffron-500 z-20">
        <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12">
            <div className="flex items-center gap-2 text-xs font-bold tracking-wide" style={{ color: '#D97706' }}>
              <AlertTriangle className="w-4 h-4" />
              OFFICIAL GOVERNMENT PORTAL
            </div>
            <div className="flex items-center gap-1">
              {navItems.slice(4).map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-3 py-3 text-xs font-semibold text-gov-saffron-500 transition-all ${
                      isActive(item.path)
                        ? 'border-b-2 border-gov-saffron-500'
                        : 'hover:bg-gov-navy-800'
                    }`}
                  >
                    <div className="flex items-center gap-1">
                      <Icon className="w-3.5 h-3.5" />
                      <span>{item.label}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* Auth Modal */}
      <GoogleSignInModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
};

export default GovDualHeader;
