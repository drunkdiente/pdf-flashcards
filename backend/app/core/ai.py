import os
import json
from dotenv import load_dotenv
from openai import AsyncOpenAI
from typing import List, Dict

# Загружаем переменные окружения
load_dotenv()

# Инициализируем клиент Groq
# Важно: используем base_url для Groq
client = AsyncOpenAI(
    base_url="https://api.groq.com/openai/v1",
    api_key=os.getenv("GROQ_API_KEY")
)

async def generate_flashcards_from_text(text: str) -> List[Dict[str, str]]:
    """
    Асинхронно генерирует карточки из текста с помощью Groq (Llama 3).
    """
    # Если текст пустой, возвращаем пустой список
    if not text:
        return []

    # Обрезаем текст, так как у моделей есть лимит контекста (хотя у Llama он большой)
    # 20 000 символов - безопасный лимит для бесплатного тарифа
    truncated_text = text[:20000]

    system_prompt = """
    Ты профессиональный преподаватель. Твоя задача — создать эффективные учебные карточки (flashcards) на основе присланного текста.
    
    Требования:
    1. Выдели ключевые понятия, даты, определения и факты.
    2. Создай пары "question" (вопрос) - "answer" (ответ).
    3. Ответы должны быть точными и краткими (1-2 предложения).
    4. Вопросы должны быть понятными.
    5. Используй язык оригинала текста (если текст на русском — вопросы на русском).
    
    ВАЖНО: ВЕРНИ РЕЗУЛЬТАТ СТРОГО В ФОРМАТЕ JSON. 
    Не пиши никаких вступлений типа "Вот ваши карточки". Только чистый JSON.
    Структура:
    {
        "cards": [
            {"question": "Вопрос 1", "answer": "Ответ 1"},
            {"question": "Вопрос 2", "answer": "Ответ 2"}
        ]
    }
    """

    try:
        response = await client.chat.completions.create(
            # Модель Llama 3.3 70B - очень мощная и доступна бесплатно в Groq
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Текст для обработки:\n\n{truncated_text}"}
            ],
            # Включаем JSON mode, чтобы модель не ошибалась с форматом
            response_format={"type": "json_object"}, 
            temperature=0.3,
        )

        # Парсим ответ
        content = response.choices[0].message.content
        data = json.loads(content)
        return data.get("cards", [])

    except Exception as e:
        print(f"Error calling Groq API: {e}")
        return []