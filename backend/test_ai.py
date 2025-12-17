import os
from dotenv import load_dotenv
from google import genai

load_dotenv()

def test_connection():
    api_key = os.getenv("GOOGLE_API_KEY")
    client = genai.Client(api_key=api_key)

    print("Попытка получить список моделей...")
    try:
        models = client.models.list()
        print("УСПЕХ! Найдены модели:")
        for m in models:
            # Просто печатаем имя, без сложных проверок
            print(f" - {m.name}")
                
    except Exception as e:
        print(f"\nОШИБКА: {e}")

if __name__ == "__main__":
    test_connection()