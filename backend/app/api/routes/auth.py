from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel, EmailStr

router = APIRouter()

# Pydantic модели для запросов/ответов
class UserRegister(BaseModel):
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

# Заглушки эндпоинтов
@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserRegister):
    """
    Регистрация нового пользователя
    TODO: Реализовать логику регистрации
    """
    # Заглушка - всегда возвращаем успех для тестирования
    return {
        "access_token": "stub-jwt-token-for-user-" + user_data.email,
        "token_type": "bearer"
    }

@router.post("/login", response_model=Token)
async def login(user_data: UserLogin):
    """
    Вход пользователя
    TODO: Реализовать логику входа
    """
    # Заглушка - всегда возвращаем успех для тестирования
    return {
        "access_token": "stub-jwt-token-for-user-" + user_data.email,
        "token_type": "bearer"
    }