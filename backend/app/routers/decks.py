from fastapi import APIRouter, HTTPException, Depends, status
from typing import List
from app.schemas import Deck, DeckCreate, Card
from app.db import fake_decks_db
from app.routers.auth import get_current_user
import uuid

router = APIRouter()

@router.get("/", response_model=List[Deck])
async def get_decks(current_user: dict = Depends(get_current_user)):
    """
    Получить колоды.
    Админ видит все. Обычный юзер - только свои.
    """
    if current_user["role"] == "admin":
        return list(fake_decks_db)
    
    # Фильтруем колоды по owner_id
    user_decks = [d for d in fake_decks_db if d.get("owner_id") == current_user["id"]]
    return user_decks

@router.get("/{deck_id}", response_model=Deck)
async def get_deck(deck_id: str, current_user: dict = Depends(get_current_user)):
    """Получить одну колоду по ID с проверкой доступа"""
    target_deck = None
    for deck in fake_decks_db:
        if deck["id"] == deck_id:
            target_deck = deck
            break
    
    if not target_deck:
        raise HTTPException(status_code=404, detail="Deck not found")
        
    # Проверка прав: Владелец или Админ
    if target_deck.get("owner_id") != current_user["id"] and current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="You do not have permission to view this deck")

    return target_deck

@router.post("/", response_model=Deck)
async def create_deck(deck_data: DeckCreate, current_user: dict = Depends(get_current_user)):
    """Создать новую колоду"""
    
    new_deck_id = str(uuid.uuid4())
    
    processed_cards = []
    for card_data in deck_data.cards:
        processed_cards.append({
            "id": str(uuid.uuid4()),
            "question": card_data.question,
            "answer": card_data.answer
        })
    
    new_deck = {
        "id": new_deck_id,
        "owner_id": current_user["id"], # Привязываем к текущему пользователю
        "title": deck_data.title,
        "description": deck_data.description,
        "cards": processed_cards
    }
    
    fake_decks_db.append(new_deck)
    return new_deck

@router.delete("/{deck_id}", status_code=204)
async def delete_deck(deck_id: str, current_user: dict = Depends(get_current_user)):
    """Удалить колоду (RBAC: Owner or Admin)"""
    global fake_decks_db
    
    # Ищем колоду
    deck_to_delete = next((d for d in fake_decks_db if d["id"] == deck_id), None)
    
    if not deck_to_delete:
        raise HTTPException(status_code=404, detail="Deck not found")
    
    # ПРОВЕРКА ПРАВ
    is_owner = deck_to_delete.get("owner_id") == current_user["id"]
    is_admin = current_user["role"] == "admin"
    
    if not is_owner and not is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="Not enough permissions to delete this deck"
        )

    # Удаление
    fake_decks_db = [d for d in fake_decks_db if d["id"] != deck_id]
    return # 204 No Content