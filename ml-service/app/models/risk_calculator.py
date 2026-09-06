"""
PahaarSaathi ML Service - Inference & Risk Calculator
Loads trained models and provides prediction methods.
"""

import os
import json
import numpy as np
import joblib
from typing import Dict, Any, Tuple
from app.schemas.risk_schemas import StaticFeatures, DynamicFeatures

class RiskCalculator:
    _instance = None

    def __init__(self):
        self.artifact_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "..", "trained_artifacts")
        self.static_model_path = os.path.join(self.artifact_dir, "static_model.joblib")
        self.dynamic_model_path = os.path.join(self.artifact_dir, "dynamic_model.joblib")
        self.metrics_path = os.path.join(self.artifact_dir, "metrics.json")
        
        self.static_model = None
        self.dynamic_model = None
        self.metrics = {}
        self.class_names = ["Low", "Moderate", "High", "Very High"]
        
        self.load_or_train()

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = RiskCalculator()
        return cls._instance

    def load_or_train(self):
        if not os.path.exists(self.static_model_path) or not os.path.exists(self.dynamic_model_path):
            print("[RiskCalculator] Trained artifacts not found. Initiating training pipeline...")
            from app.training.train_models import train_and_evaluate
            self.metrics = train_and_evaluate()
        
        try:
            self.static_model = joblib.load(self.static_model_path)
            self.dynamic_model = joblib.load(self.dynamic_model_path)
            if os.path.exists(self.metrics_path):
                with open(self.metrics_path, "r", encoding="utf-8") as f:
                    self.metrics = json.load(f)
            print("[RiskCalculator] Loaded production models and evaluation metrics.")
        except Exception as e:
            print(f"[RiskCalculator] Error loading models: {e}. Retraining...")
            from app.training.train_models import train_and_evaluate
            self.metrics = train_and_evaluate()
            self.static_model = joblib.load(self.static_model_path)
            self.dynamic_model = joblib.load(self.dynamic_model_path)

    def predict_static_risk(self, features: StaticFeatures) -> Dict[str, Any]:
        feat_vector = np.array([[
            features.slope_angle_deg,
            features.slope_aspect_deg,
            features.plan_curvature,
            features.elevation_m,
            features.dist_to_road_cut_m,
            features.land_cover_code,
            features.lithology_class,
            features.historical_landslide_density
        ]])

        probs = self.static_model.predict_proba(feat_vector)[0]
        pred_class_idx = int(np.argmax(probs))
        pred_class = self.class_names[pred_class_idx]

        # Continuous susceptibility score weighted by class probabilities
        # (0*P(Low) + 0.33*P(Mod) + 0.66*P(High) + 1.0*P(VHigh))
        weights = np.array([0.1, 0.4, 0.75, 0.95])
        continuous_score = float(np.dot(probs, weights))

        class_prob_dict = {
            self.class_names[i]: round(float(probs[i]), 4) for i in range(len(self.class_names))
        }

        return {
            "static_score": round(continuous_score, 4),
            "static_class": pred_class,
            "class_probabilities": class_prob_dict,
            "model_version": self.metrics.get("model_metadata", {}).get("version", "1.2.0-ner-production")
        }

    def predict_dynamic_trigger(self, static_score: float, static_class: str, rainfall: DynamicFeatures) -> Dict[str, Any]:
        # High/Very High susceptibility proxy
        static_susceptibility_prob = min(max(static_score, 0.0), 1.0)
        
        dyn_vector = np.array([[
            static_susceptibility_prob,
            rainfall.rainfall_1d_mm,
            rainfall.rainfall_3d_mm,
            rainfall.rainfall_7d_mm,
            rainfall.rainfall_rate_change
        ]])

        trigger_probs = self.dynamic_model.predict_proba(dyn_vector)[0]
        trigger_prob = float(trigger_probs[1])

        # Antecedent Soil Saturation Index (0 - 100)
        saturation_index = min(100.0, (rainfall.rainfall_1d_mm * 0.4) + (rainfall.rainfall_3d_mm * 0.35) + (rainfall.rainfall_7d_mm * 0.15))

        # Dynamic trigger multiplier & level
        if saturation_index < 35.0 and trigger_prob < 0.25:
            trigger_level = "NORMAL"
            multiplier = 1.0
            rec_action = "Routine monitoring. Normal slope stability status."
        elif saturation_index < 70.0 and trigger_prob < 0.50:
            trigger_level = "WATCH"
            multiplier = 1.25
            rec_action = "Heighten vigilance along road-cut slopes and drainage channels. Field officers on standby."
        elif saturation_index < 120.0 and trigger_prob < 0.75:
            trigger_level = "WARNING"
            multiplier = 1.60
            rec_action = "Issue advisory to vulnerable settlements. Restrict non-essential vehicular traffic on vulnerable mountain ghats."
        else:
            trigger_level = "ALERT"
            multiplier = 2.0
            rec_action = "CRITICAL: Immediate evacuation of high-susceptibility toe settlements. Activate SDRF/NDRF search and rescue staging."

        # Composite Landslide Hazard Score (Non-linear combination of static susceptibility and dynamic trigger)
        composite_score = min(1.0, max(0.0, static_score * (0.6 + 0.4 * multiplier) + (trigger_prob * 0.35)))

        if composite_score < 0.30:
            composite_level = "LOW"
        elif composite_score < 0.58:
            composite_level = "MODERATE"
        elif composite_score < 0.80:
            composite_level = "HIGH"
        else:
            composite_level = "VERY_HIGH"

        return {
            "composite_risk_score": round(composite_score, 4),
            "composite_risk_level": composite_level,
            "dynamic_trigger_level": trigger_level,
            "dynamic_multiplier": round(multiplier, 2),
            "trigger_probability": round(trigger_prob, 4),
            "antecedent_saturation_index": round(saturation_index, 2),
            "recommended_action": rec_action,
            "model_version": self.metrics.get("model_metadata", {}).get("version", "1.2.0-ner-production")
        }

    def get_metrics(self) -> Dict[str, Any]:
        return self.metrics
