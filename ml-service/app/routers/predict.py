from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from app.schemas.risk_schemas import (
    StaticRiskRequest, StaticRiskResponse,
    DynamicTriggerRequest, DynamicTriggerResponse,
    BatchPredictionRequest, CompositeGridResponse
)
from app.models.risk_calculator import RiskCalculator

router = APIRouter(prefix="/predict", tags=["Prediction"])

@router.post("/static-risk", response_model=StaticRiskResponse)
def predict_static_risk(req: StaticRiskRequest):
    calculator = RiskCalculator.get_instance()
    try:
        res = calculator.predict_static_risk(req.features)
        return StaticRiskResponse(
            cell_id=req.cell_id or "cell-001",
            latitude=req.latitude,
            longitude=req.longitude,
            static_score=res["static_score"],
            static_class=res["static_class"],
            class_probabilities=res["class_probabilities"],
            model_version=res["model_version"]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Static prediction error: {str(e)}")

@router.post("/dynamic-trigger", response_model=DynamicTriggerResponse)
def predict_dynamic_trigger(req: DynamicTriggerRequest):
    calculator = RiskCalculator.get_instance()
    try:
        res = calculator.predict_dynamic_trigger(
            static_score=req.static_score,
            static_class=req.static_class,
            rainfall=req.rainfall
        )
        return DynamicTriggerResponse(
            cell_id=req.cell_id or "cell-001",
            composite_risk_score=res["composite_risk_score"],
            composite_risk_level=res["composite_risk_level"],
            dynamic_trigger_level=res["dynamic_trigger_level"],
            dynamic_multiplier=res["dynamic_multiplier"],
            trigger_probability=res["trigger_probability"],
            antecedent_saturation_index=res["antecedent_saturation_index"],
            recommended_action=res["recommended_action"],
            model_version=res["model_version"]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Dynamic prediction error: {str(e)}")

@router.post("/composite-grid", response_model=CompositeGridResponse)
def predict_composite_grid(req: BatchPredictionRequest):
    calculator = RiskCalculator.get_instance()
    results = []
    high_count = 0
    vhigh_count = 0

    for cell in req.cells:
        static_res = calculator.predict_static_risk(cell.static_features)
        dyn_res = calculator.predict_dynamic_trigger(
            static_score=static_res["static_score"],
            static_class=static_res["static_class"],
            rainfall=cell.rainfall_features
        )
        
        if dyn_res["composite_risk_level"] == "HIGH":
            high_count += 1
        elif dyn_res["composite_risk_level"] == "VERY_HIGH":
            vhigh_count += 1

        results.append({
            "cell_id": cell.cell_id,
            "district_id": cell.district_id,
            "latitude": cell.latitude,
            "longitude": cell.longitude,
            "static_score": static_res["static_score"],
            "static_class": static_res["static_class"],
            "composite_risk_score": dyn_res["composite_risk_score"],
            "composite_risk_level": dyn_res["composite_risk_level"],
            "dynamic_trigger_level": dyn_res["dynamic_trigger_level"],
            "trigger_probability": dyn_res["trigger_probability"],
            "antecedent_saturation_index": dyn_res["antecedent_saturation_index"],
            "recommended_action": dyn_res["recommended_action"]
        })

    return CompositeGridResponse(
        total_cells=len(results),
        high_risk_count=high_count,
        very_high_risk_count=vhigh_count,
        predictions=results
    )
