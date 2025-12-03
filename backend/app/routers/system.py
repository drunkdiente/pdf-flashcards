from fastapi import APIRouter

router = APIRouter()

@router.get("/healthcheck", tags=["System"])
async def health_check():
    """
    Проверка работоспособности сервера.
    """
    return {"status": "ok", "service": "flashcards-backend"}