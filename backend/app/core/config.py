import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # Базовые настройки
    PROJECT_NAME: str = "Учебные карточки из PDF"
    VERSION: str = "0.1.0"
    API_V1_STR: str = "/api"
    
    # Настройки CORS
    ALLOWED_ORIGINS: list = ["http://localhost:3000", "http://127.0.0.1:3000"]
    
    # Настройки базы данных (пока заглушки)
    DATABASE_URL: str = "postgresql+asyncpg://user:pass@localhost/flashcards"
    
    # JWT настройки (пока заглушки)
    SECRET_KEY: str = "your-secret-key-here-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    class Config:
        env_file = ".env"

settings = Settings()