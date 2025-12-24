from pydantic import BaseModel
from typing import List, Optional

# --- CARDS ---
class CardBase(BaseModel):
    question: str
    answer: str

class CardCreate(CardBase):
    pass

class Card(CardBase):
    id: str
    
# --- DECKS ---
class DeckBase(BaseModel):
    title: str
    description: Optional[str] = None

class DeckCreate(DeckBase):
    # ВАЖНО: Разрешаем принимать список карточек при создании
    cards: List[CardCreate] = []

class Deck(DeckBase):
    id: str
    cards: List[Card] = []