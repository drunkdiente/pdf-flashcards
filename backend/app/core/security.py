from datetime import datetime, timedelta
from typing import Optional, Union, Any
from jose import jwt, JWTError
from passlib.context import CryptContext
from fastapi import HTTPException, status

# КОНФИГУРАЦИЯ (В продакшене брать из .env)
SECRET_KEY = "YOUR_SUPER_SECRET_KEY_CHANGE_ME"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
REFRESH_TOKEN_EXPIRE_DAYS = 7

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def create_token(subject: Union[str, Any], expires_delta: timedelta, token_type: str = "access") -> str:
    encode = {"sub": str(subject), "type": token_type}
    expire = datetime.utcnow() + expires_delta
    
    # Стандартные поля JWT
    encode.update({"exp": expire, "iat": datetime.utcnow()})
    
    encoded_jwt = jwt.encode(encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def create_access_token(subject: Union[str, Any]) -> str:
    return create_token(subject, timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES), "access")

def create_refresh_token(subject: Union[str, Any]) -> str:
    return create_token(subject, timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS), "refresh")

def decode_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None