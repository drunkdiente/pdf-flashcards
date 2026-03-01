import json
from openai import AsyncOpenAI
from typing import List, Dict

# Настраиваем клиент на локальный адрес Ollama
client = AsyncOpenAI(
    base_url="http://127.0.0.1:11434/v1",
    api_key="ollama"
)

async def generate_flashcards_from_text(text: str) -> List[Dict[str, str]]:
    """
    Генерирует карточки локально через Ollama (Llama 3).
    """
    if not text:
        return []

    # Обрезаем текст, чтобы не перегрузить локальную модель (6000 символов - безопасно)
    truncated_text = text[:6000]

    system_prompt = """
    Ты профессиональный преподаватель. Создай учебные карточки из текста.
    1. Выдели главные факты.
    2. Создай пары "question" и "answer".
    3. Ответы должны быть краткими (1-2 предложения).
    4. Верни ТОЛЬКО валидный JSON. Никаких вступлений.
    
    Формат JSON:
    {
        "cards": [
            {"question": "Вопрос 1", "answer": "Ответ 1"},
            {"question": "Вопрос 2", "answer": "Ответ 2"}
        ]
    }
    """

    try:
        response = await client.chat.completions.create(
            model="llama3.2",  # Имя модели, которую вы скачали
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Текст для обработки:\n{truncated_text}"}
            ],
            response_format={"type": "json_object"}, 
            temperature=0.3,
        )

        content = response.choices[0].message.content
        data = json.loads(content)
        return data.get("cards", [])

    except Exception as e:
        print(f"Error calling Local Ollama: {e}")
        # Если локальная модель упала, вернем пустой список или ошибку
        return []