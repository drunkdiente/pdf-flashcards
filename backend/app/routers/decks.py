from fastapi import APIRouter, HTTPException, Depends
from typing import List
from app.schemas import Deck, DeckCreate, Card
from app.db import fake_decks_db # Используем нашу in-memory базу
import uuid

router = APIRouter()

@router.get("/", response_model=List[Deck])
async def get_decks():
    """Получить все колоды"""
    # Преобразуем словарь в список
    return list(fake_decks_db)

@router.get("/{deck_id}", response_model=Deck)
async def get_deck(deck_id: str):
    """Получить одну колоду по ID"""
    for deck in fake_decks_db:
        if deck["id"] == deck_id:
            return deck
    raise HTTPException(status_code=404, detail="Deck not found")

@router.post("/", response_model=Deck)
async def create_deck(deck_data: DeckCreate):
    """Создать новую колоду вместе с карточками"""
    
    # 1. Генерируем ID для новой колоды
    new_deck_id = str(uuid.uuid4())
    
    # 2. Обрабатываем карточки (им тоже нужны ID)
    processed_cards = []
    for card_data in deck_data.cards:
        processed_cards.append({
            "id": str(uuid.uuid4()),
            "question": card_data.question,
            "answer": card_data.answer
        })
    
    # 3. Собираем объект колоды
    new_deck = {
        "id": new_deck_id,
        "title": deck_data.title,
        "description": deck_data.description,
        "cards": processed_cards
    }
    
    # 4. Сохраняем в "базу"
    fake_decks_db.append(new_deck)
    
    return new_deck

@router.delete("/{deck_id}")
async def delete_deck(deck_id: str):
    """Удалить колоду"""
    global fake_decks_db
    # Фильтруем список, оставляя все колоды КРОМЕ той, которую удаляем
    fake_decks_db = [d for d in fake_decks_db if d["id"] != deck_id]
    return {"message": "Deck deleted"}