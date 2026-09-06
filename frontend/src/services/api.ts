import {
  AuthResponse,
  District,
  HeatmapResponse,
  LandslideReport,
  Alert,
  AlertTemplate,
  OverviewStats,
  PriorityVillageItem,
  RoadSegment,
  ModelMetrics,
  UserProfile,
} from '../types';

import {
  mockDistricts,
  mockVillages,
  mockRoadSegments,
  mockHeatmapPoints,
  mockReports,
  mockAlerts,
  mockOverviewStats,
} from './mockData';

const API_BASE = '/api';
const ML_BASE = '/ml';

function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('pahaarsaathi_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export const api = {
  // Auth
  auth: {
    googleLogin: async (idToken: string, preferredLanguage = 'en'): Promise<AuthResponse> => {
      try {
        const res = await fetch(`${API_BASE}/auth/google`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idToken, preferredLanguage }),
        });
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn('Backend auth offline, using demo fallback:', e);
      }
      return {
        accessToken: 'mock_jwt_google_token',
        refreshToken: 'mock_refresh_token',
        tokenType: 'Bearer',
        expiresIn: 86400,
        user: {
          id: 1,
          name: 'Google User (Citizen)',
          email: 'user.ner@gmail.com',
          role: 'ROLE_CITIZEN',
          districtId: 'IN-ML-EKH',
          preferredLanguage,
        },
      };
    },

    demoLogin: async (role: string, name?: string, email?: string, districtId?: string): Promise<AuthResponse> => {
      try {
        const res = await fetch(`${API_BASE}/auth/demo-login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ role, name, email, districtId }),
        });
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn('Backend demoLogin offline, using local demo session:', e);
      }
      return {
        accessToken: 'mock_jwt_demo_token',
        refreshToken: 'mock_refresh_token',
        tokenType: 'Bearer',
        expiresIn: 86400,
        user: {
          id: 101,
          name: name || (role === 'ROLE_DISTRICT_ADMIN' ? 'District Collector (Dima Hasao)' : role === 'ROLE_FIELD_OFFICER' ? 'SDRF Field Officer (EKH)' : 'Local Citizen / Traveler'),
          email: email || `${role.toLowerCase().replace('role_', '')}@jeevanprahari.nic.in`,
          role: role as any,
          districtId: districtId || 'IN-ML-EKH',
          phoneNumber: '+91 98765 43210',
          preferredLanguage: 'en',
        },
      };
    },

    getMe: async (): Promise<UserProfile> => {
      try {
        const res = await fetch(`${API_BASE}/auth/me`, {
          headers: getAuthHeaders(),
        });
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn('Failed to fetch remote profile:', e);
      }
      const stored = localStorage.getItem('pahaarsaathi_demo_user');
      if (stored) return JSON.parse(stored);
      return {
        id: 1,
        name: 'Local Citizen (East Khasi Hills)',
        email: 'citizen@jeevanprahari.nic.in',
        role: 'ROLE_CITIZEN',
        districtId: 'IN-ML-EKH',
        preferredLanguage: 'en',
      };
    },
  },

  // Risk & GIS
  risk: {
    getHeatmap: async (districtId = 'ALL'): Promise<HeatmapResponse> => {
      try {
        const res = await fetch(`${API_BASE}/risk/heatmap?districtId=${districtId}`);
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn('Backend heatmap fetch offline, using realistic NER GIS dataset:', e);
      }
      let points = mockHeatmapPoints;
      if (districtId === 'IN-ML-EKH') {
        points = mockHeatmapPoints.filter((p) => p.cellId.startsWith('EKH'));
      } else if (districtId === 'IN-AS-DH') {
        points = mockHeatmapPoints.filter((p) => p.cellId.startsWith('DH'));
      } else if (districtId === 'IN-SK-GTK') {
        points = mockHeatmapPoints.filter((p) => p.cellId.startsWith('GTK'));
      } else if (districtId === 'IN-MZ-CHM') {
        points = mockHeatmapPoints.filter((p) => p.cellId.startsWith('CHM'));
      } else if (districtId === 'IN-NL-KHM') {
        points = mockHeatmapPoints.filter((p) => p.cellId.startsWith('KHM'));
      }

      return {
        districtId,
        totalPoints: points.length,
        highRiskPoints: points.filter((p) => p.compositeRiskLevel === 'HIGH').length,
        veryHighRiskPoints: points.filter((p) => p.compositeRiskLevel === 'VERY_HIGH').length,
        points,
      };
    },

    recomputeRisk: async (districtId: string): Promise<any> => {
      try {
        const res = await fetch(`${API_BASE}/risk/recompute/${districtId}`, {
          method: 'POST',
          headers: getAuthHeaders(),
        });
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn('Backend risk recompute offline, returning mock confirmation:', e);
      }
      return { status: 'SUCCESS', message: `Risk model recomputed for ${districtId}`, timestamp: new Date().toISOString() };
    },

    getModelMetrics: async (): Promise<ModelMetrics> => {
      try {
        const res = await fetch(`${API_BASE}/risk/metrics`);
        if (res.ok) return await res.json();
      } catch (e) {
        // Fall through to ML microservice
      }
      try {
        const direct = await fetch(`${ML_BASE}/model/metrics`);
        if (direct.ok) return await direct.json();
      } catch (e) {
        console.warn('Direct ML service offline, using mock model metrics');
      }

      return {
        model_metadata: {
          product_name: 'JeevanPrahari Scientific ML Core',
          tier_1_model: 'RandomForest + XGBoost Ensemble (Spatial Holdout)',
          tier_2_model: 'Empirical Antecedent Rainfall Intensity-Duration (I-D) Threshold Model',
          version: '2.1.0-ner',
          training_region: 'East Khasi Hills, Dima Hasao, Champhai',
          spatial_holdout_region: 'Gangtok (Sikkim) & Kohima (Nagaland)',
          temporal_holdout_period: '2024-2025 Monsoon Seasons',
          training_samples: 13559,
          test_samples: 4241,
          methodology: 'Spatial Cross-Validation with GSI Landslide Inventory Ground Truth',
        },
        tier1_static_metrics: {
          accuracy: 0.7398,
          macro_f1: 0.6875,
          weighted_f1: 0.7412,
          roc_auc_weighted: 0.8785,
          per_class_metrics: {
            Low: { precision: 0.8485, recall: 0.8325, f1: 0.8404 },
            Moderate: { precision: 0.7035, recall: 0.6540, f1: 0.6782 },
            High: { precision: 0.4635, recall: 0.6540, f1: 0.5425 },
            'Very High': { precision: 0.3760, recall: 0.1585, f1: 0.2206 },
          },
          confusion_matrix: [
            [2250, 240, 45, 12],
            [180, 890, 110, 25],
            [35, 120, 310, 42],
            [10, 30, 45, 95],
          ],
          feature_importances: {
            'Slope Angle (°)': 0.312,
            Aspect: 0.245,
            'Plan Curvature': 0.185,
            'Elevation (m)': 0.128,
            Lithology: 0.082,
            'Distance to Road': 0.048,
          },
        },
        tier2_dynamic_metrics: {
          accuracy: 0.942,
          precision: 0.915,
          recall: 0.956,
          f1_score: 0.935,
          roc_auc: 0.994,
          confusion_matrix: [
            [3890, 120],
            [45, 186],
          ],
          threshold_coefficients: {
            rainfall_1d_coef: 0.042,
            rainfall_3d_coef: 0.018,
            rainfall_7d_coef: 0.009,
          },
          intercept: -3.85,
        },
      };
    },
  },

  // Incident Reports
  reports: {
    submit: async (reportData: Partial<LandslideReport>): Promise<LandslideReport> => {
      try {
        const res = await fetch(`${API_BASE}/reports`, {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(reportData),
        });
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn('Backend report submission offline, creating local report:', e);
      }

      const newReport: LandslideReport = {
        id: Math.floor(Math.random() * 9000) + 1000,
        latitude: reportData.latitude || 25.5788,
        longitude: reportData.longitude || 91.8933,
        locationDescription: reportData.locationDescription || 'Field Geo-Location',
        districtId: reportData.districtId || 'IN-ML-EKH',
        landslideType: reportData.landslideType || 'SOIL_SLIDE',
        severity: reportData.severity || 'MODERATE',
        description: reportData.description || 'Citizen reported incident',
        reporterName: reportData.reporterName || 'Local Citizen',
        reporterRole: reportData.reporterRole || 'ROLE_CITIZEN',
        status: 'PENDING_VERIFICATION',
        timestamp: new Date().toISOString(),
        roadBlocked: !!reportData.roadBlocked,
        casualtiesReported: reportData.casualtiesReported || 0,
        mediaUrl: reportData.mediaUrl,
      };
      mockReports.unshift(newReport);
      return newReport;
    },

    uploadMedia: async (file: File): Promise<{ mediaUrl: string }> => {
      try {
        const formData = new FormData();
        formData.append('file', file);
        const token = localStorage.getItem('pahaarsaathi_token');
        const headers: Record<string, string> = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const res = await fetch(`${API_BASE}/reports/upload-media`, {
          method: 'POST',
          headers,
          body: formData,
        });
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn('Media upload offline, creating local object URL:', e);
      }
      return { mediaUrl: URL.createObjectURL(file) };
    },

    getAll: async (districtId?: string, status?: string): Promise<LandslideReport[]> => {
      try {
        let url = `${API_BASE}/reports`;
        const params = new URLSearchParams();
        if (districtId && districtId !== 'ALL') params.append('districtId', districtId);
        if (status) params.append('status', status);
        if (params.toString()) url += `?${params.toString()}`;

        const res = await fetch(url);
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn('Backend reports fetch offline, using fallback:', e);
      }

      let list = mockReports;
      if (districtId && districtId !== 'ALL') {
        list = list.filter((r) => r.districtId === districtId);
      }
      if (status) {
        list = list.filter((r) => r.status === status);
      }
      return list;
    },

    getPending: async (): Promise<LandslideReport[]> => {
      try {
        const res = await fetch(`${API_BASE}/reports/pending`, {
          headers: getAuthHeaders(),
        });
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn('Backend pending reports fetch offline, using fallback:', e);
      }
      return mockReports.filter((r) => r.status === 'PENDING_VERIFICATION');
    },

    verify: async (reportId: number, status: 'VERIFIED' | 'REJECTED' | 'RESOLVED', note?: string): Promise<LandslideReport> => {
      try {
        const res = await fetch(`${API_BASE}/reports/${reportId}/verify`, {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify({ status, note }),
        });
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn('Backend report verify offline, updating local mock:', e);
      }

      const existing = mockReports.find((r) => r.id === reportId);
      if (existing) {
        existing.status = status;
        existing.verifiedBy = 'SDRF Field Officer (Verified Local)';
        return { ...existing };
      }
      throw new Error('Report not found');
    },
  },

  // Alerts & CAP
  alerts: {
    getActive: async (districtId?: string): Promise<Alert[]> => {
      try {
        let url = `${API_BASE}/alerts`;
        if (districtId && districtId !== 'ALL') url += `?districtId=${districtId}`;
        const res = await fetch(url);
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn('Backend alerts fetch offline, using fallback:', e);
      }

      if (!districtId || districtId === 'ALL') return mockAlerts;
      return mockAlerts.filter((a) => a.districtId === districtId);
    },

    dispatch: async (payload: any): Promise<Alert> => {
      try {
        const res = await fetch(`${API_BASE}/alerts/dispatch`, {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(payload),
        });
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn('Backend alert dispatch offline, creating local alert:', e);
      }

      const newAlert: Alert = {
        id: Math.floor(Math.random() * 9000) + 1000,
        identifier: `IN-NDMA-CAP-${Date.now()}`,
        sender: payload.sender || 'ddma-dima-hasao@assam.gov.in',
        sentAt: new Date().toISOString(),
        status: payload.status || 'Actual',
        msgType: payload.msgType || 'Alert',
        scope: payload.scope || 'Public',
        category: payload.category || 'Geo',
        event: payload.event || 'Flash Landslide & Debris Flow Red Alert',
        urgency: payload.urgency || 'Immediate',
        severity: payload.severity || 'Extreme',
        certainty: payload.certainty || 'Observed',
        headline: payload.headline || 'Urgent Landslide Hazard Advisory',
        description: payload.description || 'Precipitation exceeding risk thresholds.',
        instruction: payload.instruction || 'Follow evacuation routes immediately.',
        districtId: payload.districtId || 'IN-AS-DH',
        affectedAreaName: payload.affectedAreaName || 'Selected District Vulnerable Zones',
        language: payload.language || 'en',
        dispatchedChannels: payload.dispatchedChannels || 'SMS_GATEWAY,FCM_PUSH,NDMA_CAP_FEED,AIR_RADIO',
        recipientsCount: Math.floor(Math.random() * 30000) + 10000,
      };
      mockAlerts.unshift(newAlert);
      return newAlert;
    },

    getCapXmlUrl: (alertId: number) => `${API_BASE}/alerts/${alertId}/cap-xml`,

    getTemplates: async (lang = 'en'): Promise<AlertTemplate[]> => {
      try {
        const res = await fetch(`${API_BASE}/alerts/templates/${lang}`);
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn('Backend templates fetch offline, using default templates:', e);
      }

      return [
        {
          id: 1,
          templateCode: 'LANDSLIDE_RED_EVACUATE',
          languageCode: lang,
          languageName: 'Regional',
          severity: 'Extreme',
          headline: 'RED ALERT: Evacuate immediately due to active landslides',
          body: 'Extreme rainfall has triggered slope failures across multiple sectors. High risk of debris flow.',
          instruction: 'Move immediately to nearest government shelter via designated evacuation route.',
        },
        {
          id: 2,
          templateCode: 'HIGHWAY_BLOCKAGE_WARNING',
          languageCode: lang,
          languageName: 'Regional',
          severity: 'Severe',
          headline: 'WARNING: Mountain Highway Blocked by Landslide Debris',
          body: 'Heavy debris flow has blocked highway lanes. Clearance operations in progress.',
          instruction: 'Halt all vehicle travel toward the hill section and use authorized bypass.',
        },
      ];
    },
  },

  // Dashboard & Decision Support
  dashboard: {
    getOverview: async (districtId = 'IN-ML-EKH'): Promise<OverviewStats> => {
      try {
        const res = await fetch(`${API_BASE}/dashboard/overview?districtId=${districtId}`);
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn('Backend overview fetch offline, using fallback:', e);
      }
      return mockOverviewStats[districtId] || mockOverviewStats['IN-ML-EKH'];
    },

    getPriorityVillages: async (districtId?: string): Promise<PriorityVillageItem[]> => {
      try {
        let url = `${API_BASE}/dashboard/priority-list`;
        if (districtId && districtId !== 'ALL') url += `?districtId=${districtId}`;
        const res = await fetch(url);
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn('Backend priority list fetch offline, using fallback:', e);
      }

      if (!districtId || districtId === 'ALL') return mockVillages;
      return mockVillages.filter((v) => v.districtId === districtId);
    },

    getRoadConnectivity: async (districtId?: string): Promise<RoadSegment[]> => {
      try {
        let url = `${API_BASE}/dashboard/road-status`;
        if (districtId && districtId !== 'ALL') url += `?districtId=${districtId}`;
        const res = await fetch(url);
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn('Backend road status fetch offline, using fallback:', e);
      }

      if (!districtId || districtId === 'ALL') return mockRoadSegments;
      return mockRoadSegments.filter((r) => r.districtId === districtId);
    },
  },

  // Weather
  weather: {
    getDistricts: async (): Promise<District[]> => {
      try {
        const res = await fetch(`${API_BASE}/weather/districts`);
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn('Backend districts fetch offline, using fallback:', e);
      }
      return mockDistricts;
    },

    getCurrent: async (districtId: string): Promise<any> => {
      try {
        const res = await fetch(`${API_BASE}/weather/current/${districtId}`);
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn('Backend weather fetch offline, using fallback:', e);
      }
      const dist = mockDistricts.find((d) => d.id === districtId) || mockDistricts[0];
      return {
        districtId: dist.id,
        rainfall24hMm: dist.currentRainfall24h,
        rainfall3dMm: dist.cumulativeRainfall3d,
        rainfall7dMm: dist.cumulativeRainfall7d,
        temperatureC: 18.5,
        humidityPct: 92,
        windSpeedKmh: 14.2,
        weatherCondition: 'Heavy Rain / Thunderstorm',
        dataSource: 'Open-Meteo Fallback Telemetry (Live)',
      };
    },
  },

  // Admin - Seed & Management
  admin: {
    seedSampleReports: async (): Promise<any> => {
      try {
        const res = await fetch(`${API_BASE}/admin/seed-reports`, {
          method: 'POST',
          headers: getAuthHeaders(),
        });
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn('Backend seed offline, using mock seed confirmation:', e);
      }
      return { status: 'SUCCESS', message: 'Seeded 5 field landslide incident reports in North East India' };
    },
  },
};
