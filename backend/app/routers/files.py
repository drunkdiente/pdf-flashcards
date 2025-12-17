from fastapi import APIRouter, UploadFile, File, HTTPException
from pypdf import PdfReader
from io import BytesIO
from app.schemas import Deck, Card
from app.core.ai import generate_flashcards_from_text
import uuid

router = APIRouter()

@router.post("/upload/pdf", response_model=Deck, tags=["Files & AI"])
async def upload_pdf(file: UploadFile = File(...)):
    """
    Принимает PDF, извлекает текст, генерирует карточки через AI
    и возвращает готовую колоду (превью).
    """
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="File must be a PDF")
    
    # 1. Читаем PDF из памяти
    try:
        content = await file.read()
        pdf_file = BytesIO(content)
        reader = PdfReader(pdf_file)
        
        extracted_text = ""
        for page in reader.pages:
            extracted_text += page.extract_text() or ""
            
        if len(extracted_text) < 50:
            raise HTTPException(status_code=400, detail="PDF is empty or not readable (scanned image?)")
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error reading PDF: {str(e)}")

    # 2. Отправляем текст в AI (ML Magic)
    ai_cards_data = await generate_flashcards_from_text(extracted_text)
    
    if not ai_cards_data:
        raise HTTPException(status_code=500, detail="AI failed to generate cards")

    # 3. Формируем объект колоды
    # Превращаем сырые dict в объекты Card
    cards_objects = []
    for card in ai_cards_data:
        cards_objects.append(
            Card(id=str(uuid.uuid4()), question=card["question"], answer=card["answer"])
        )

    new_deck = Deck(
        id=str(uuid.uuid4()),
        title=f"Конспект: {file.filename}",
        description="Сгенерировано AI",
        cards=cards_objects
    )
    
    # Важно: Мы пока возвращаем колоду, но НЕ сохраняем её в базу автоматически.
    # Frontend должен показать превью, и если юзер нажмет "Сохранить", 
    # тогда фронт отправит данные на POST /api/decks/
    
    return new_deck