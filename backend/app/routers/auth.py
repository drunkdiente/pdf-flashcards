from fastapi import APIRouter, Depends, HTTPException, status, Response, Request
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel, EmailStr
from typing import Optional, List
from slowapi import Limiter
from slowapi.util import get_remote_address

from app.schemas import UserAuth, UserOut, TokenSchema
from app.services.auth_service import AuthService
from app.repositories.user_repository import UserRepository
from app.dependencies import get_auth_service, get_user_repository

limiter = Limiter(key_func=get_remote_address)
router = APIRouter()

# --- Middleware / Dependency ---
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

async def get_current_user(token: str = Depends(oauth2_scheme), auth_service: AuthService = Depends(get_auth_service)):
    return auth_service.get_current_user_from_token(token)

async def get_current_admin(current_user: dict = Depends(get_current_user)):
    """Проверка прав администратора (RBAC)"""
    if current_user.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="Not enough privileges. Admin role required."
        )
    return current_user

# --- Endpoints ---

@router.post("/register", status_code=201)
async def register(user_data: UserAuth, auth_service: AuthService = Depends(get_auth_service)):
    auth_service.register_user(user_data)
    return {"message": "User created successfully"}

@router.post("/login", response_model=TokenSchema)
@limiter.limit("5/minute")
async def login(request: Request, response: Response, form_data: OAuth2PasswordRequestForm = Depends(), auth_service: AuthService = Depends(get_auth_service)):
    user = auth_service.authenticate_user(form_data.username, form_data.password)
    
    # Мы генерируем access_token в auth_service, но refresh_token мы тоже должны сгенерировать.
    # Давайте добавим генерацию токенов в login (или вынесем методы в AuthService)
    from app.core.security import create_access_token, create_refresh_token
    access_token = create_access_token(subject=user["email"])
    refresh_token = create_refresh_token(subject=user["email"])
    
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=7 * 24 * 60 * 60
    )
    
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "role": user.get("role", "user")
    }

@router.post("/refresh", response_model=TokenSchema)
async def refresh_token(request: Request, response: Response, auth_service: AuthService = Depends(get_auth_service)):
    refresh_token = request.cookies.get("refresh_token")
    if not refresh_token:
        raise HTTPException(status_code=401, detail="Refresh token missing")
        
    access_token, user = auth_service.refresh_token(refresh_token)
    
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "role": user.get("role", "user")
    }

@router.post("/logout")
async def logout(response: Response, token: str = Depends(oauth2_scheme), auth_service: AuthService = Depends(get_auth_service)):
    auth_service.logout(token)
    response.delete_cookie("refresh_token")
    return {"message": "Logged out successfully"}

@router.get("/me", response_model=UserOut)
async def read_users_me(current_user: dict = Depends(get_current_user)):
    return current_user

# --- ADMIN ENDPOINTS ---
@router.get("/users", response_model=List[UserOut])
async def read_all_users(admin_user: dict = Depends(get_current_admin), user_repo: UserRepository = Depends(get_user_repository)):
    """
    Только для администраторов: получить список всех пользователей.
    """
    return user_repo.get_all()