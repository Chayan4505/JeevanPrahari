from fastapi import APIRouter
import time

router = APIRouter(tags=["Health"])

START_TIME = time.time()

@router.get("/health")
def health_check():
    return {
        "status": "UP",
        "service": "pahaarsaathi-ml-service",
        "uptime_seconds": round(time.time() - START_TIME, 2),
        "version": "1.2.0-ner-production"
    }
