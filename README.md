# Flashcards AI — Fullstack Project

## Стек технологий
- **Backend**: Python + FastAPI
- **Frontend**: TypeScript + React + Vite + TailwindCSS
- **AI**: Ollama (Llama 3.2) / OpenAI
- **Storage**: S3-совместимое объектное хранилище
- **Контейнеризация**: Docker + Docker Compose + Nginx
- **CI/CD**: GitHub Actions

## Быстрый старт

### Локальный запуск (без Docker)

`ash
# Backend
cd backend
pip install -r requirements.txt
uvicorn main:app --reload

# Frontend (в новом терминале)
cd frontend
npm install
npm run dev
``n
### Запуск через Docker Compose

`ash
docker compose up --build
``n
- Frontend: http://localhost
- Backend API: http://localhost:8000
- Swagger UI: http://localhost:8000/docs

## Тестирование

### Backend
`ash
cd backend
pytest tests/ -v
``n
### Frontend (Unit)
`ash
cd frontend
npm run test
``n
### E2E (Playwright)
`ash
cd frontend
npx playwright test
``n
## Переменные окружения

Скопируйте .env.example в .env и заполните реальными значениями.

## Лабораторные работы

- **ЛР 1–4**: Реализованы в предыдущих версиях (RBAC, Auth, UI, SEO, Storage)
- **ЛР 5**: Комплексное тестирование (ackend/tests/, rontend/src/**/__tests__, rontend/e2e/)
- **ЛР 6**: Контейнеризация и CI/CD (Dockerfile, docker-compose.yml, .github/workflows/ci-cd.yml)

