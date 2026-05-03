from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import system, decks, files, auth, seo, dictionary

app = FastAPI(
    title="Flashcards AI Backend",
    description="API для сервиса генерации учебных карточек из PDF",
    version="1.0.0"
)

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(system.router)
app.include_router(files.router, prefix="/api")
app.include_router(decks.router, prefix="/api/decks")
app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(seo.router)
app.include_router(dictionary.router, prefix="/api/dictionary")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)