export type UserRole = 'ROLE_CITIZEN' | 'ROLE_FIELD_OFFICER' | 'ROLE_DISTRICT_ADMIN' | 'ROLE_SUPER_ADMIN';

export interface UserProfile {
  id: number;
  email: string;
  name: string;
  pictureUrl?: string;
  role: UserRole;
  districtId?: string;
  phoneNumber?: string;
  preferredLanguage: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: UserProfile;
}

export interface District {
  id: string;
  name: string;
  state: string;
  latitude: number;
  longitude: number;
  population: number;
  areaSqKm: number;
  emergencyHelpline: string;
  dmaControlRoomContact?: string;
  currentRainfall24h: number;
  cumulativeRainfall3d: number;
  cumulativeRainfall7d: number;
  currentRiskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'VERY_HIGH';
  triggerStatus: 'NORMAL' | 'WATCH' | 'WARNING' | 'ALERT';
}

export interface Village {
  id: number;
  name: string;
  districtId: string;
  latitude: number;
  longitude: number;
  population: number;
  vulnerabilityIndex: number;
  nearestShelterName: string;
  nearestShelterDistKm: number;
  evacuationRoute?: string;
  compositeRiskScore: number;
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'VERY_HIGH';
  priorityScore: number;
}

export type PriorityVillageItem = Village;


export interface RoadSegment {
  id: number;
  roadNumber: string;
  segmentName: string;
  districtId: string;
  startLat: number;
  startLon: number;
  endLat: number;
  endLon: number;
  lengthKm: number;
  criticalityIndex: number;
  status: 'PASSABLE' | 'CAUTION' | 'CRITICAL' | 'BLOCKED';
  blockageCause?: string;
  alternateRouteAdvisory?: string;
  currentHazardScore: number;
}

export interface RiskHeatmapPoint {
  cellId: string;
  latitude: number;
  longitude: number;
  staticScore: number;
  staticClass: 'Low' | 'Moderate' | 'High' | 'Very High';
  compositeRiskScore: number;
  compositeRiskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'VERY_HIGH';
  dynamicTriggerLevel: 'NORMAL' | 'WATCH' | 'WARNING' | 'ALERT';
  rainfall1dMm: number;
  slopeAngleDeg: number;
}

export interface HeatmapResponse {
  districtId: string;
  totalPoints: number;
  highRiskPoints: number;
  veryHighRiskPoints: number;
  points: RiskHeatmapPoint[];
}

export interface LandslideReport {
  id: number;
  latitude: number;
  longitude: number;
  locationDescription: string;
  districtId: string;
  landslideType: 'DEBRIS_FLOW' | 'ROCKFALL' | 'SOIL_SLIDE' | 'ROAD_SUBSIDENCE' | 'TENSION_CRACK';
  severity: 'MINOR' | 'MODERATE' | 'SEVERE' | 'CATASTROPHIC';
  description: string;
  mediaUrl?: string;
  mediaThumbnailUrl?: string;
  reporterName: string;
  reporterPhone?: string;
  reporterRole: string;
  status: 'PENDING_VERIFICATION' | 'VERIFIED' | 'RESOLVED' | 'REJECTED';
  verifiedBy?: string;
  offlineSyncId?: string;
  timestamp: string;
  roadBlocked: boolean;
  casualtiesReported: number;
}

export interface Alert {
  id: number;
  identifier: string;
  sender: string;
  sentAt: string;
  status: string;
  msgType: string;
  scope: string;
  category: string;
  event: string;
  urgency: string;
  severity: 'Extreme' | 'Severe' | 'Moderate' | 'Minor';
  certainty: string;
  headline: string;
  description: string;
  instruction?: string;
  districtId: string;
  affectedAreaName?: string;
  language: string;
  dispatchedChannels: string;
  recipientsCount: number;
  capXml?: string;
  createdBy?: string;
}

export interface AlertTemplate {
  id: number;
  templateCode: string;
  languageCode: string;
  languageName: string;
  severity: string;
  headline: string;
  body: string;
  instruction: string;
}

export interface OverviewStats {
  districtId: string;
  districtName: string;
  state: string;
  currentRiskLevel: string;
  triggerStatus: string;
  rainfall24hMm: number;
  rainfall3dMm: number;
  rainfall7dMm: number;
  highRiskVillagesCount: number;
  blockedRoadsCount: number;
  pendingIncidentReportsCount: number;
  activeAlertsCount: number;
  emergencyHelpline: string;
  lastUpdated: string;
}

export interface ModelMetrics {
  model_metadata: {
    product_name: string;
    tier_1_model: string;
    tier_2_model: string;
    version: string;
    training_region: string;
    spatial_holdout_region: string;
    temporal_holdout_period: string;
    training_samples: number;
    test_samples: number;
    methodology: string;
  };
  tier1_static_metrics: {
    accuracy: number;
    macro_f1: number;
    weighted_f1: number;
    roc_auc_weighted: number;
    per_class_metrics: Record<string, { precision: number; recall: number; f1: number }>;
    confusion_matrix: number[][];
    feature_importances: Record<string, number>;
  };
  tier2_dynamic_metrics: {
    accuracy: number;
    precision: number;
    recall: number;
    f1_score: number;
    roc_auc: number;
    confusion_matrix: number[][];
    threshold_coefficients: Record<string, number>;
    intercept: number;
  };
}
