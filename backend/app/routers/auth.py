from fastapi import APIRouter, Depends, HTTPException, status, Response, Request
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel, EmailStr
from app.core.security import (
    get_password_hash, verify_password, create_access_token, 
    create_refresh_token, decode_token
)
from app.db import fake_users_db, blacklist_db 
from typing import Optional
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)
router = APIRouter()

# --- Schemas ---
class UserAuth(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: str
    email: EmailStr
    
class TokenSchema(BaseModel):
    access_token: str
    token_type: str

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
    user = fake_users_db.get(user_email) # Имитация поиска в БД
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
        
    return user

# --- Endpoints ---

@router.post("/register", status_code=201)
async def register(user_data: UserAuth):
    if user_data.email in fake_users_db:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_pw = get_password_hash(user_data.password)
    fake_users_db[user_data.email] = {
        "id": str(len(fake_users_db) + 1),
        "email": user_data.email,
        "hashed_password": hashed_pw
    }
    return {"message": "User created successfully"}

@router.post("/login", response_model=TokenSchema)
@limiter.limit("5/minute")
async def login(request: Request, response: Response, form_data: OAuth2PasswordRequestForm = Depends()):
    user = fake_users_db.get(form_data.username)
    
    if not user or not verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    
    # Генерация токенов (используем form_data.username как sub)
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
    
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/refresh", response_model=TokenSchema)
async def refresh_token(request: Request, response: Response):
    refresh_token = request.cookies.get("refresh_token")
    if not refresh_token:
        raise HTTPException(status_code=401, detail="Refresh token missing")
        
    payload = decode_token(refresh_token)
    if not payload or payload.get("type") != "refresh":
        raise HTTPException(status_code=401, detail="Invalid refresh token")
        
    new_access_token = create_access_token(subject=payload.get("sub"))
    return {"access_token": new_access_token, "token_type": "bearer"}

@router.post("/logout")
async def logout(response: Response, token: str = Depends(oauth2_scheme)):
    # Инвалидация токенов
    blacklist_db.add(token) # Добавляем access token в черный список
    response.delete_cookie("refresh_token") # Удаляем куку
    return {"message": "Logged out successfully"}

@router.get("/me", response_model=UserOut)
async def read_users_me(current_user: dict = Depends(get_current_user)):
    return current_user