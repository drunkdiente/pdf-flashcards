from pydantic import BaseModel, EmailStr
from typing import List, Optional

# --- CARDS ---
class CardBase(BaseModel):
    question: str
    answer: str

class CardCreate(CardBase):
    pass

class Card(CardBase):
    id: str
    
import datetime

# --- DECKS ---
class DeckBase(BaseModel):
    title: str
    description: Optional[str] = None
    file_key: Optional[str] = None
    file_name: Optional[str] = None

class DeckCreate(DeckBase):
    cards: List[CardCreate] = []

class Deck(DeckBase):
    id: str
    owner_id: str # Добавили поле владельца
    cards: List[Card] = []
    created_at: Optional[datetime.datetime] = None

# --- USERS ---
class UserAuth(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: str
    email: EmailStr
    role: str = "user" # Добавили поле роли

class TokenSchema(BaseModel):
    access_token: str
    token_type: str
    role: str # Возвращаем роль сразу при логине для удобства фронтенда