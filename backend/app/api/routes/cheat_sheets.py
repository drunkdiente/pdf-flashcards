from fastapi import APIRouter, HTTPException, status, UploadFile, File, Depends
from pydantic import BaseModel
from typing import List, Optional
from uuid import UUID, uuid4
from datetime import datetime

router = APIRouter()

# Pydantic модели
class CardBase(BaseModel):
    question: str
    answer: str

class CardCreate(CardBase):
    pass

class CardResponse(CardBase):
    id: UUID
    order_index: int

class CheatSheetBase(BaseModel):
    title: str

class CheatSheetCreate(CheatSheetBase):
    pass

class CheatSheetResponse(CheatSheetBase):
    id: UUID
    user_id: UUID
    created_at: datetime
    updated_at: datetime
    cards: List[CardResponse] = []

class CheatSheetListResponse(BaseModel):
    items: List[CheatSheetResponse]
    total: int

# Заглушки эндпоинтов
@router.post("/upload-pdf", status_code=status.HTTP_202_ACCEPTED)
async def upload_pdf(file: UploadFile = File(...)):
    """
    Загрузка PDF файла для создания шпаргалки
    TODO: Реализовать обработку PDF и интеграцию с Yandex GPT
    """
    if not file.filename.endswith('.pdf'):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PDF files are allowed"
        )
    
    # Заглушка - возвращаем фейковые карточки для тестирования
    stub_cards = [
        {"id": uuid4(), "question": "Что такое Python?", "answer": "Язык программирования", "order_index": 0},
        {"id": uuid4(), "question": "Что такое FastAPI?", "answer": "Фреймворк для создания API", "order_index": 1},
    ]
    
    return {
        "cheat_sheet_id": uuid4(),
        "status": "processing",
        "estimated_time": 30,
        "preview_cards": stub_cards
    }

@router.get("/", response_model=CheatSheetListResponse)
async def list_cheat_sheets(skip: int = 0, limit: int = 10):
    """
    Получить список шпаргалок пользователя
    TODO: Реализовать получение из БД с пагинацией
    """
    # Заглушка - возвращаем фейковые данные
    stub_cheat_sheets = [
        {
            "id": uuid4(),
            "title": "Конспект по Python",
            "user_id": uuid4(),
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "cards": []
        }
    ]
    
    return {
        "items": stub_cheat_sheets,
        "total": 1
    }

@router.get("/{cheat_sheet_id}", response_model=CheatSheetResponse)
async def get_cheat_sheet(cheat_sheet_id: UUID):
    """
    Получить конкретную шпаргалку с карточками
    TODO: Реализовать получение из БД
    """
    # Заглушка
    return {
        "id": cheat_sheet_id,
        "title": "Конспект по Python",
        "user_id": uuid4(),
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
        "cards": [
            {"id": uuid4(), "question": "Вопрос 1", "answer": "Ответ 1", "order_index": 0},
            {"id": uuid4(), "question": "Вопрос 2", "answer": "Ответ 2", "order_index": 1},
        ]
    }

@router.put("/{cheat_sheet_id}", response_model=CheatSheetResponse)
async def update_cheat_sheet(cheat_sheet_id: UUID, cheat_sheet_data: CheatSheetCreate):
    """
    Обновить шпаргалку
    TODO: Реализовать обновление в БД
    """
    # Заглушка
    return {
        "id": cheat_sheet_id,
        "title": cheat_sheet_data.title,
        "user_id": uuid4(),
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
        "cards": []
    }

@router.delete("/{cheat_sheet_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_cheat_sheet(cheat_sheet_id: UUID):
    """
    Удалить шпаргалку
    TODO: Реализовать удаление из БД
    """
    # Заглушка - просто возвращаем 204
    return