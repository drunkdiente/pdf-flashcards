import httpx
import os
import re
from fastapi import HTTPException

class DictionaryService:
    def __init__(self):
        self.en_url = "https://api.dictionaryapi.dev/api/v2/entries/en/"
        # Используем классический и стабильный API Википедии
        self.ru_url = "https://ru.wikipedia.org/w/api.php"

    def _is_russian(self, word: str) -> bool:
        """Определяет, есть ли в слове кириллица"""
        return bool(re.search('[а-яА-ЯёЁ]', word))

    async def get_definition(self, word: str) -> dict:
        is_ru = self._is_russian(word)
        
        # Задаем базовые заголовки
        headers = {"User-Agent": "FlashcardsApp/1.0"}
        
        async with httpx.AsyncClient(timeout=5.0, follow_redirects=True) as client: 
            try:
                if is_ru:
                    # Параметры для стабильного API Википедии
                    params = {
                        "action": "query",
                        "prop": "extracts",
                        "exsentences": 2, # Берем только первые 2 предложения
                        "explaintext": 1, # Очищаем от HTML-тегов
                        "format": "json",
                        "redirects": 1,   # Автоматически исправлять опечатки/ссылки
                        "titles": word
                    }
                    response = await client.get(self.ru_url, params=params, headers=headers)
                    response.raise_for_status()
                    data = response.json()
                    
                    # Парсим ответ Википедии
                    pages = data.get("query", {}).get("pages", {})
                    page = list(pages.values())[0] # Берем первую найденную страницу
                    
                    # Если страницы нет, Википедия возвращает ключ "missing"
                    if "missing" in page or not page.get("extract"):
                        return {"word": word, "definition": None, "found": False}
                        
                    return {"word": word, "definition": page["extract"], "found": True}
                    
                else:
                    # Для английских слов оставляем Free Dictionary
                    response = await client.get(f"{self.en_url}{word}", headers=headers)
                    
                    if response.status_code == 404:
                        return {"word": word, "definition": None, "found": False}
                    
                    response.raise_for_status()
                    data = response.json()
                    
                    meanings = data[0].get("meanings", [])
                    if not meanings:
                        return {"word": word, "definition": None, "found": False}
                    first_def = meanings[0]["definitions"][0]["definition"]
                    return {"word": word, "definition": first_def, "found": True}

            except Exception as e:
                # Теперь, если что-то упадет, мы увидим реальную причину в консоли бекенда
                print(f"!!! Ошибка словаря: {type(e).__name__} - {str(e)}") 
                raise HTTPException(status_code=502, detail="Внешний сервис временно недоступен")