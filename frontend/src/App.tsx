import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { OfflineProvider } from './context/OfflineContext';
import { ThemeProvider } from './context/ThemeContext';
import { AccessibilityBar } from './components/layout/AccessibilityBar';
import { GovDualHeader } from './components/layout/GovDualHeader';
import { Footer } from './components/layout/Footer';
import { OfflineBanner } from './components/layout/OfflineBanner';

// Pages
import { HomePage } from './pages/HomePage';
import { RiskMapPage } from './pages/RiskMapPage';
import { ReportPage } from './pages/ReportPage';
import { AlertsPage } from './pages/AlertsPage';
import { DistrictDashboardPage } from './pages/DistrictDashboardPage';
import { ModelInsightsPage } from './pages/ModelInsightsPage';
import { AboutPage } from './pages/AboutPage';

// Guard for District Admin & Officer Dashboard
const AdminGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, hasRole } = useAuth();
  if (!isAuthenticated || !hasRole(['ROLE_DISTRICT_ADMIN', 'ROLE_SUPER_ADMIN', 'ROLE_FIELD_OFFICER'])) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

export const AppContent: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 selection:bg-gov-navy-700 selection:text-white">
      <AccessibilityBar />
      <GovDualHeader />
      <OfflineBanner />
      
      <main className="flex-1" id="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/map" element={<RiskMapPage />} />
          <Route path="/report" element={<ReportPage />} />
          <Route path="/alerts" element={<AlertsPage />} />
          <Route
            path="/dashboard"
            element={
              <AdminGuard>
                <DistrictDashboardPage />
              </AdminGuard>
            }
          />
          <Route path="/model-insights" element={<ModelInsightsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <OfflineProvider>
            <Router>
              <AppContent />
            </Router>
          </OfflineProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;
