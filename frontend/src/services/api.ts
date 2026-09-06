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
      const res = await fetch(`${API_BASE}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken, preferredLanguage }),
      });
      if (!res.ok) throw new Error('Google Login Failed');
      return res.json();
    },

    demoLogin: async (role: string, name?: string, email?: string, districtId?: string): Promise<AuthResponse> => {
      const res = await fetch(`${API_BASE}/auth/demo-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, name, email, districtId }),
      });
      if (!res.ok) throw new Error('Demo Login Failed');
      return res.json();
    },

    getMe: async (): Promise<UserProfile> => {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error('Failed to fetch profile');
      return res.json();
    },
  },

  // Risk & GIS
  risk: {
    getHeatmap: async (districtId = 'ALL'): Promise<HeatmapResponse> => {
      const res = await fetch(`${API_BASE}/risk/heatmap?districtId=${districtId}`);
      if (!res.ok) throw new Error('Failed to fetch heatmap data');
      return res.json();
    },

    recomputeRisk: async (districtId: string): Promise<any> => {
      const res = await fetch(`${API_BASE}/risk/recompute/${districtId}`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error('Failed to recompute risk');
      return res.json();
    },

    getModelMetrics: async (): Promise<ModelMetrics> => {
      // First try proxy /api/risk/metrics from backend, fallback to direct ML endpoint
      try {
        const res = await fetch(`${API_BASE}/risk/metrics`);
        if (res.ok) return res.json();
      } catch (e) {
        console.warn('Backend metrics fetch failed, trying direct ML service...');
      }
      const direct = await fetch(`${ML_BASE}/model/metrics`);
      if (!direct.ok) throw new Error('Failed to fetch ML model metrics');
      return direct.json();
    },
  },

  // Incident Reports
  reports: {
    submit: async (reportData: Partial<LandslideReport>): Promise<LandslideReport> => {
      const res = await fetch(`${API_BASE}/reports`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(reportData),
      });
      if (!res.ok) throw new Error('Failed to submit report');
      return res.json();
    },

    uploadMedia: async (file: File): Promise<{ mediaUrl: string }> => {
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
      if (!res.ok) throw new Error('Failed to upload file');
      return res.json();
    },

    getAll: async (districtId?: string, status?: string): Promise<LandslideReport[]> => {
      let url = `${API_BASE}/reports`;
      const params = new URLSearchParams();
      if (districtId && districtId !== 'ALL') params.append('districtId', districtId);
      if (status) params.append('status', status);
      if (params.toString()) url += `?${params.toString()}`;

      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch reports');
      return res.json();
    },

    getPending: async (): Promise<LandslideReport[]> => {
      const res = await fetch(`${API_BASE}/reports/pending`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error('Failed to fetch pending reports');
      return res.json();
    },

    verify: async (reportId: number, status: 'VERIFIED' | 'REJECTED' | 'RESOLVED', note?: string): Promise<LandslideReport> => {
      const res = await fetch(`${API_BASE}/reports/${reportId}/verify`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status, note }),
      });
      if (!res.ok) throw new Error('Failed to verify report');
      return res.json();
    },
  },

  // Alerts & CAP
  alerts: {
    getActive: async (districtId?: string): Promise<Alert[]> => {
      let url = `${API_BASE}/alerts`;
      if (districtId && districtId !== 'ALL') url += `?districtId=${districtId}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch alerts');
      return res.json();
    },

    dispatch: async (payload: any): Promise<Alert> => {
      const res = await fetch(`${API_BASE}/alerts/dispatch`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to dispatch alert');
      return res.json();
    },

    getCapXmlUrl: (alertId: number) => `${API_BASE}/alerts/${alertId}/cap-xml`,

    getTemplates: async (lang = 'en'): Promise<AlertTemplate[]> => {
      const res = await fetch(`${API_BASE}/alerts/templates/${lang}`);
      if (!res.ok) return [];
      return res.json();
    },
  },

  // Dashboard & Decision Support
  dashboard: {
    getOverview: async (districtId = 'IN-ML-EKH'): Promise<OverviewStats> => {
      const res = await fetch(`${API_BASE}/dashboard/overview?districtId=${districtId}`);
      if (!res.ok) throw new Error('Failed to fetch overview stats');
      return res.json();
    },

    getPriorityVillages: async (districtId?: string): Promise<PriorityVillageItem[]> => {
      let url = `${API_BASE}/dashboard/priority-list`;
      if (districtId && districtId !== 'ALL') url += `?districtId=${districtId}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch priority settlements');
      return res.json();
    },

    getRoadConnectivity: async (districtId?: string): Promise<RoadSegment[]> => {
      let url = `${API_BASE}/dashboard/road-status`;
      if (districtId && districtId !== 'ALL') url += `?districtId=${districtId}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch road connectivity');
      return res.json();
    },
  },

  // Weather
  weather: {
    getDistricts: async (): Promise<District[]> => {
      const res = await fetch(`${API_BASE}/weather/districts`);
      if (!res.ok) throw new Error('Failed to fetch districts');
      return res.json();
    },

    getCurrent: async (districtId: string): Promise<any> => {
      const res = await fetch(`${API_BASE}/weather/current/${districtId}`);
      if (!res.ok) throw new Error('Failed to fetch weather telemetry');
      return res.json();
    },
  },

  // Admin - Seed & Management
  admin: {
    seedSampleReports: async (): Promise<any> => {
      const res = await fetch(`${API_BASE}/admin/seed-reports`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error('Failed to seed sample reports');
      return res.json();
    },
  },
};
