from fastapi import APIRouter, UploadFile, File, HTTPException
from app.schemas import Deck
from typing import List
import uuid

router = APIRouter()

@router.post("/upload/pdf", response_model=Deck, tags=["Files & AI"])
async def upload_pdf(file: UploadFile = File(...)):
    """
    Эндпоинт для загрузки PDF файла.
    Здесь должна происходить магия AI-сегментации.
    """
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="File must be a PDF")

    mock_ai_deck = {
        "id": str(uuid.uuid4()),
        "title": f"Конспект из {file.filename}",
        "description": "Автоматически сгенерировано",
        "cards": [
            {"id": str(uuid.uuid4()), "question": "Пример вопроса из PDF?", "answer": "Сгенерированный ответ"},
            {"id": str(uuid.uuid4()), "question": "Второй вопрос?", "answer": "Второй ответ"}
        ]
    }
    
    return mock_ai_deck