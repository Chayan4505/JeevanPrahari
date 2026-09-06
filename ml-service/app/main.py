"""
PahaarSaathi ML Service - Main Application
FastAPI microservice for Landslide Risk Evaluation across North Eastern Region (NER).
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import predict, metrics, health
from app.models.risk_calculator import RiskCalculator

app = FastAPI(
    title="PahaarSaathi ML Microservice",
    description="Scientific Landslide Susceptibility & Dynamic Rainfall Trigger Scoring Engine for North East India",
    version="1.2.0-ner-production",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Enable CORS for internal and dev networks
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(health.router)
app.include_router(predict.router)
app.include_router(metrics.router)

@app.on_event("startup")
def startup_event():
    print("[PahaarSaathi ML] Initializing model inference engine...")
    RiskCalculator.get_instance()
    print("[PahaarSaathi ML] Inference engine ready on port 8000.")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
