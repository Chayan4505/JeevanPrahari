from fastapi import APIRouter
from typing import Dict, Any
from app.models.risk_calculator import RiskCalculator

router = APIRouter(prefix="/model", tags=["Model Insights & Metrics"])

@router.get("/metrics", response_model=Dict[str, Any])
def get_model_metrics():
    """
    Returns authentic training and validation metrics evaluated on spatial and temporal holdout datasets.
    Exposes confusion matrix, precision/recall per class, and feature importances.
    """
    calculator = RiskCalculator.get_instance()
    return calculator.get_metrics()
