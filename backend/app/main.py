from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.routes import health, auth, cheat_sheets

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="API для преобразования PDF в учебные карточки",
    version=settings.VERSION
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Подключаем роуты
app.include_router(health.router, prefix=settings.API_V1_STR, tags=["health"])
app.include_router(auth.router, prefix=f"{settings.API_V1_STR}/auth", tags=["auth"])
app.include_router(cheat_sheets.router, prefix=f"{settings.API_V1_STR}/cheat-sheets", tags=["cheat-sheets"])

@app.get("/")
async def root():
    return {"message": settings.PROJECT_NAME, "version": settings.VERSION}