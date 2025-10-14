from fastapi import APIRouter, status
from datetime import datetime
import psutil
import os

router = APIRouter()

@router.get("/health", status_code=status.HTTP_200_OK)
async def health_check():
    """Базовый health-check"""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "service": "flashcards-api"
    }

@router.get("/health/detailed", status_code=status.HTTP_200_OK)
async def detailed_health_check():
    """Детальный health-check с системной информацией"""
    process = psutil.Process(os.getpid())
    
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "service": "flashcards-api",
        "system": {
            "cpu_percent": psutil.cpu_percent(),
            "memory_percent": round(psutil.virtual_memory().percent, 2),
            "process_memory_mb": round(process.memory_info().rss / 1024 / 1024, 2)
        }
    }