from fastapi import APIRouter, HTTPException, Depends, status, Query
from typing import List, Optional
from app.schemas import Deck, DeckCreate, Card
from app.db import fake_decks_db
from app.routers.auth import get_current_user
from app.services.storage import storage_service
import uuid
import datetime

router = APIRouter()

@router.get("/", response_model=List[Deck])
async def get_decks(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    search: Optional[str] = None,
    sort_by: Optional[str] = Query("title", description="Field to sort by (title, created_at)"),
    sort_order: Optional[str] = Query("asc", regex="^(asc|desc)$"),
    min_cards: Optional[int] = None,
    max_cards: Optional[int] = None,
    current_user: dict = Depends(get_current_user)
):
    """
    Получить колоды.
    Админ видит все. Обычный юзер - только свои.
    """
    if current_user["role"] == "admin":
        user_decks = list(fake_decks_db)
    else:
        user_decks = [d for d in fake_decks_db if d.get("owner_id") == current_user["id"]]
        
    # Filter
    if search:
        s = search.lower()
        user_decks = [d for d in user_decks if s in d.get("title", "").lower() or s in d.get("description", "").lower()]
        
    if min_cards is not None:
        user_decks = [d for d in user_decks if len(d.get("cards", [])) >= min_cards]
        
    if max_cards is not None:
        user_decks = [d for d in user_decks if len(d.get("cards", [])) <= max_cards]
        
    # Sort
    reverse = sort_order == "desc"
    if sort_by == "created_at":
        # Handle cases where created_at might be None in older mock data
        user_decks.sort(key=lambda x: x.get("created_at") or datetime.datetime.min, reverse=reverse)
    else:
        user_decks.sort(key=lambda x: x.get("title", ""), reverse=reverse)
        
    # Paginate
    return user_decks[skip : skip + limit]

@router.get("/{deck_id}", response_model=Deck)
async def get_deck(deck_id: str, current_user: dict = Depends(get_current_user)):
    """Получить одну колоду по ID с проверкой доступа"""
    target_deck = next((d for d in fake_decks_db if d["id"] == deck_id), None)
    
    if not target_deck:
        raise HTTPException(status_code=404, detail="Deck not found")
        
    if target_deck.get("owner_id") != current_user["id"] and current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="You do not have permission to view this deck")

    return target_deck
    
@router.get("/{deck_id}/file")
async def get_deck_file(deck_id: str, current_user: dict = Depends(get_current_user)):
    """Получить ссылку на скачивание файла PDF для колоды"""
    target_deck = next((d for d in fake_decks_db if d["id"] == deck_id), None)
    
    if not target_deck:
        raise HTTPException(status_code=404, detail="Deck not found")
        
    if target_deck.get("owner_id") != current_user["id"] and current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="You do not have permission to access this file")

    file_key = target_deck.get("file_key")
    if not file_key:
        raise HTTPException(status_code=404, detail="No file attached to this deck")
        
    url = storage_service.get_presigned_url(file_key)
    return {"url": url}

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
        "owner_id": current_user["id"],
        "title": deck_data.title,
        "description": deck_data.description,
        "cards": processed_cards,
        "file_key": deck_data.file_key,
        "file_name": deck_data.file_name,
        "created_at": datetime.datetime.utcnow()
    }
    
    fake_decks_db.append(new_deck)
    return new_deck

@router.delete("/{deck_id}", status_code=204)
async def delete_deck(deck_id: str, current_user: dict = Depends(get_current_user)):
    """Удалить колоду (RBAC: Owner or Admin)"""
    global fake_decks_db
    
    deck_to_delete = next((d for d in fake_decks_db if d["id"] == deck_id), None)
    
    if not deck_to_delete:
        raise HTTPException(status_code=404, detail="Deck not found")
    
    is_owner = deck_to_delete.get("owner_id") == current_user["id"]
    is_admin = current_user["role"] == "admin"
    
    if not is_owner and not is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="Not enough permissions to delete this deck"
        )

    # Удалить физический файл если он есть
    file_key = deck_to_delete.get("file_key")
    if file_key:
        try:
            storage_service.delete_file(file_key)
        except Exception as e:
            print("Failed to delete file from obj storage:", e)

    # Удаление
    fake_decks_db = [d for d in fake_decks_db if d["id"] != deck_id]
    return # 204 No Content