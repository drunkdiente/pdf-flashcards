from pydantic import BaseModel
from typing import List, Optional
from uuid import UUID, uuid4

# Модель одной карточки (Вопрос-Ответ)
class CardBase(BaseModel):
    question: str
    answer: str

class Card(CardBase):
    id: str = str(uuid4())

# Модель колоды (Название + список карточек)
class DeckBase(BaseModel):
    title: str
    description: Optional[str] = None

class DeckCreate(DeckBase):
    pass

class Deck(DeckBase):
    id: str
    cards: List[Card] = []

    class Config:
        from_attributes = True