from fastapi import APIRouter, Depends, HTTPException, status, Response, Request
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel, EmailStr
from app.core.security import (
    get_password_hash, verify_password, create_access_token, 
    create_refresh_token, decode_token
)
from app.db import fake_users_db, blacklist_db 
from typing import Optional, List
from slowapi import Limiter
from slowapi.util import get_remote_address
from app.schemas import UserAuth, UserOut, TokenSchema # Импортируем обновленные схемы

limiter = Limiter(key_func=get_remote_address)
router = APIRouter()

# --- Middleware / Dependency ---
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

async def get_current_user(token: str = Depends(oauth2_scheme)):
    # 1. Проверка на черный список
    if token in blacklist_db:
        raise HTTPException(status_code=401, detail="Token revoked")
    
    # 2. Декодирование
    payload = decode_token(token)
    if not payload or payload.get("type") != "access":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    user_email = payload.get("sub")
    user = fake_users_db.get(user_email)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
        
    return user

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
async def register(user_data: UserAuth):
    if user_data.email in fake_users_db:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_pw = get_password_hash(user_data.password)
    fake_users_db[user_data.email] = {
        "id": str(len(fake_users_db) + 1),
        "email": user_data.email,
        "hashed_password": hashed_pw,
        "role": "user" # По умолчанию роль - пользователь
    }
    return {"message": "User created successfully"}

@router.post("/login", response_model=TokenSchema)
@limiter.limit("5/minute")
async def login(request: Request, response: Response, form_data: OAuth2PasswordRequestForm = Depends()):
    user = fake_users_db.get(form_data.username)
    
    if not user or not verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    
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
    
    # Возвращаем роль, чтобы фронтенд мог адаптировать интерфейс
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "role": user.get("role", "user")
    }

@router.post("/refresh", response_model=TokenSchema)
async def refresh_token(request: Request, response: Response):
    refresh_token = request.cookies.get("refresh_token")
    if not refresh_token:
        raise HTTPException(status_code=401, detail="Refresh token missing")
        
    payload = decode_token(refresh_token)
    if not payload or payload.get("type") != "refresh":
        raise HTTPException(status_code=401, detail="Invalid refresh token")
        
    user_email = payload.get("sub")
    user = fake_users_db.get(user_email)
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    new_access_token = create_access_token(subject=user_email)
    
    return {
        "access_token": new_access_token, 
        "token_type": "bearer",
        "role": user.get("role", "user")
    }

@router.post("/logout")
async def logout(response: Response, token: str = Depends(oauth2_scheme)):
    blacklist_db.add(token)
    response.delete_cookie("refresh_token")
    return {"message": "Logged out successfully"}

@router.get("/me", response_model=UserOut)
async def read_users_me(current_user: dict = Depends(get_current_user)):
    return current_user

# --- ADMIN ENDPOINTS ---
@router.get("/users", response_model=List[UserOut])
async def read_all_users(admin_user: dict = Depends(get_current_admin)):
    """
    Только для администраторов: получить список всех пользователей.
    """
    # Преобразуем словарь users_db в список
    return list(fake_users_db.values())