from fastapi import APIRouter
from app.services.dictionary_service import DictionaryService

router = APIRouter(tags=["Dictionary"])
dict_service = DictionaryService()

@router.get("/define")
async def define_word(word: str):
    """Получить определение слова через сторонний API"""
    return await dict_service.get_definition(word)