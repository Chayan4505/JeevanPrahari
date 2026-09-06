from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class StaticFeatures(BaseModel):
    slope_angle_deg: float = Field(..., description="Slope angle in degrees (0 - 90)")
    slope_aspect_deg: float = Field(..., description="Aspect / slope orientation in degrees (0 - 360)")
    plan_curvature: float = Field(..., description="Planar curvature of slope (-5.0 to 5.0)")
    elevation_m: float = Field(..., description="Elevation in meters above sea level (100 - 4500)")
    dist_to_road_cut_m: float = Field(..., description="Distance to nearest road / slope-cut excavation in meters")
    land_cover_code: int = Field(..., description="Land cover class: 1=Dense Forest, 2=Degraded/Shifting Cultivation, 3=Built-up/Settlement, 4=Barren/Rocky, 5=Agriculture")
    lithology_class: int = Field(..., description="Geological formation/rock strength: 1=Strong Gneiss/Granite, 2=Sandstone/Shale, 3=Unconsolidated Alluvium/Clay, 4=Fractured Schist/Phyllite")
    historical_landslide_density: float = Field(..., description="Historical landslide events per sq km from GSI/NRSC inventory")

class DynamicFeatures(BaseModel):
    rainfall_1d_mm: float = Field(..., description="Current 24h rainfall intensity in mm")
    rainfall_3d_mm: float = Field(..., description="3-day cumulative antecedent rainfall in mm")
    rainfall_7d_mm: float = Field(..., description="7-day cumulative antecedent rainfall in mm")
    rainfall_rate_change: float = Field(..., description="Rate of rainfall intensity change (mm/hr acceleration)")

class StaticRiskRequest(BaseModel):
    cell_id: Optional[str] = "cell-001"
    latitude: Optional[float] = 25.5788
    longitude: Optional[float] = 91.8933
    features: StaticFeatures

class StaticRiskResponse(BaseModel):
    cell_id: str
    latitude: Optional[float]
    longitude: Optional[float]
    static_score: float = Field(..., description="Continuous susceptibility index 0.0 - 1.0")
    static_class: str = Field(..., description="Low, Moderate, High, Very High")
    class_probabilities: Dict[str, float]
    model_version: str

class DynamicTriggerRequest(BaseModel):
    cell_id: Optional[str] = "cell-001"
    latitude: Optional[float] = 25.5788
    longitude: Optional[float] = 91.8933
    static_score: float = Field(..., ge=0.0, le=1.0)
    static_class: str = Field(..., description="Low, Moderate, High, Very High")
    rainfall: DynamicFeatures

class DynamicTriggerResponse(BaseModel):
    cell_id: str
    composite_risk_score: float = Field(..., description="Overall combined landslide hazard score 0.0 - 1.0")
    composite_risk_level: str = Field(..., description="LOW, MODERATE, HIGH, VERY_HIGH")
    dynamic_trigger_level: str = Field(..., description="NORMAL, WATCH, WARNING, ALERT")
    dynamic_multiplier: float
    trigger_probability: float
    antecedent_saturation_index: float
    recommended_action: str
    model_version: str

class GridCellPredictionRequest(BaseModel):
    cell_id: str
    district_id: str
    latitude: float
    longitude: float
    static_features: StaticFeatures
    rainfall_features: DynamicFeatures

class BatchPredictionRequest(BaseModel):
    cells: List[GridCellPredictionRequest]

class CompositeGridResponse(BaseModel):
    total_cells: int
    high_risk_count: int
    very_high_risk_count: int
    predictions: List[Dict[str, Any]]
