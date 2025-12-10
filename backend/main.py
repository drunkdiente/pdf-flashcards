from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import system, decks, files, auth

app = FastAPI(
    title="Flashcards AI Backend",
    description="API для сервиса генерации учебных карточек из PDF",
    version="1.0.0"
)

# Настройка CORS (чтобы ваш Frontend мог обращаться к этому серверу)
origins = [
    "http://localhost:5173",  # <--- ВАЖНО: Стандартный порт Vite
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins, # Используем обновленный список
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Подключение роутеров
app.include_router(system.router)
app.include_router(files.router, prefix="/api") # Эндпоинты для файлов
app.include_router(decks.router, prefix="/api/decks") # Эндпоинты для колод
app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])

if __name__ == "__main__":
    import uvicorn
    # Запуск сервера
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)