from fastapi import APIRouter, HTTPException, status
from typing import List
from app.schemas import Deck, DeckCreate, Card
from app.db import fake_decks_db
import uuid

router = APIRouter()

# --- CREATE ---
@router.post("/", response_model=Deck, status_code=status.HTTP_201_CREATED, tags=["Decks"])
async def create_deck(deck: DeckCreate):
    """Создать новую пустую колоду вручную"""
    new_deck = deck.dict()
    new_deck["id"] = str(uuid.uuid4())
    new_deck["cards"] = []
    fake_decks_db.append(new_deck)
    return new_deck

# --- READ (All) ---
@router.get("/", response_model=List[Deck], tags=["Decks"])
async def get_decks():
    """Получить список всех колод пользователя для Dashboard"""
    return fake_decks_db

# --- READ (One) ---
@router.get("/{deck_id}", response_model=Deck, tags=["Decks"])
async def get_deck(deck_id: str):
    """
    Получить конкретную колоду для режима обучения 
    или редактирования.
    """
    for deck in fake_decks_db:
        if deck["id"] == deck_id:
            return deck
    raise HTTPException(status_code=404, detail="Deck not found")

# --- UPDATE ---
@router.put("/{deck_id}", response_model=Deck, tags=["Decks"])
async def update_deck(deck_id: str, updated_deck: DeckCreate):
    """Редактирование названия или описания колоды."""
    for i, deck in enumerate(fake_decks_db):
        if deck["id"] == deck_id:
            fake_decks_db[i]["title"] = updated_deck.title
            fake_decks_db[i]["description"] = updated_deck.description
            return fake_decks_db[i]
    raise HTTPException(status_code=404, detail="Deck not found")

# --- DELETE ---
@router.delete("/{deck_id}", status_code=status.HTTP_204_NO_CONTENT, tags=["Decks"])
async def delete_deck(deck_id: str):
    """Удаление старой колоды."""
    for i, deck in enumerate(fake_decks_db):
        if deck["id"] == deck_id:
            del fake_decks_db[i]
            return
    raise HTTPException(status_code=404, detail="Deck not found")

# --- Добавление карточки в колоду (Sub-resource) ---
@router.post("/{deck_id}/cards", response_model=Card, tags=["Cards"])
async def add_card_to_deck(deck_id: str, card: Card):
    """Добавление новой карточки в существующую колоду."""
    for deck in fake_decks_db:
        if deck["id"] == deck_id:
            new_card = card.dict()
            # Генерируем ID если не передан
            if not new_card.get("id"):
                new_card["id"] = str(uuid.uuid4())
            deck["cards"].append(new_card)
            return new_card
    raise HTTPException(status_code=404, detail="Deck not found")