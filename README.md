# Flashcards AI 
Приложение для генерации учебных карточек (flashcards) из PDF-файлов с помощью ИИ. Поддерживает ролевую модель доступа (RBAC), аутентификацию через JWT (access + refresh токены), работу с объектным хранилищем S3, SEO-оптимизацию, комплексное тестирование и контейнеризацию.

---

## Стек технологий

| Слой | Технологии |
|------|-----------|
| **Backend** | Python 3.11, FastAPI, Pydantic |
| **Frontend** | TypeScript, React 19, Vite, TailwindCSS |
| **AI** | Ollama (Llama 3.2) / OpenAI GPT |
| **Storage** | S3-совместимое объектное хранилище (boto3) |
| **Auth** | JWT (python-jose), bcrypt, OAuth2 |
| **Тестирование** | pytest (backend), Vitest + Testing Library (frontend), Playwright (E2E) |
| **Контейнеризация** | Docker, Docker Compose, Nginx |
| **CI/CD** | GitHub Actions |

---

## Структура проекта

```
.
├── backend/                 # FastAPI приложение
│   ├── app/
│   │   ├── core/           # security, ai
│   │   ├── routers/        # API endpoints (auth, decks, files, seo, dictionary)
│   │   ├── services/       # бизнес-логика (auth, storage, dictionary)
│   │   ├── repositories/   # работа с данными
│   │   ├── db.py           # in-memory БД (для демо)
│   │   └── schemas.py      # Pydantic модели
│   ├── tests/              # pytest: unit + integration
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/                # React приложение
│   ├── src/
│   │   ├── components/     # UI компоненты
│   │   ├── pages/          # Страницы (Login, Register, Upload, MyDecks, ...)
│   │   ├── context/        # AuthContext
│   │   └── api.js          # Axios instance с interceptors
│   ├── e2e/                # Playwright E2E тесты
│   ├── Dockerfile
│   └── nginx.conf          # Reverse proxy config
├── docker-compose.yml       # Оркестрация сервисов
├── .github/workflows/       # CI/CD pipeline
└── .env.example             # Шаблон переменных окружения
```

---

## Быстрый старт

### 1. Клонирование и подготовка

```bash
git clone <repo-url>
cd flashcards-ai
cp .env.example .env
```

### 2. Локальный запуск (без Docker)

**Backend:**
```bash
cd backend
python -m venv venv
source venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Frontend (в новом терминале):**
```bash
cd frontend
npm install
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- Swagger UI: http://localhost:8000/docs

### 3. Запуск через Docker Compose

```bash
docker compose up --build
```

- Frontend: http://localhost
- Backend API: http://localhost:8000
- Swagger UI: http://localhost:8000/docs

---

## Тестирование

### Backend

```bash
cd backend
pytest tests/ -v
```

**Структура тестов:**
- `tests/unit/` — модульные тесты (security, auth service)
- `tests/integration/` — интеграционные тесты роутеров (auth, decks, dictionary)
- `conftest.py` — фикстуры с изолированной in-memory БД

### Frontend (Unit)

```bash
cd frontend
npm run test
```

Покрытие: компоненты (`PrivateRoute`, `Header`), страницы (`Login`).

### E2E (Playwright)

```bash
cd frontend
npx playwright test
```

Сценарии: аутентификация, защита маршрутов, ролевое поведение, навигация.


## API Endpoints

### Auth (`/api/auth`)
| Method | Endpoint | Описание | Доступ |
|--------|----------|----------|--------|
| POST | `/register` | Регистрация | все |
| POST | `/login` | Вход (OAuth2) | все |
| POST | `/refresh` | Обновление access токена | все (по cookie) |
| POST | `/logout` | Выход + revoke токена | авторизованные |
| GET | `/me` | Текущий пользователь | авторизованные |
| GET | `/users` | Список пользователей | admin only |

### Decks (`/api/decks`)
| Method | Endpoint | Описание |
|--------|----------|----------|
| GET | `/` | Список колод (фильтрация, сортировка, пагинация) |
| GET | `/{id}` | Получить колоду |
| GET | `/{id}/file` | Ссылка на скачивание PDF |
| POST | `/` | Создать колоду |
| DELETE | `/{id}` | Удалить колоду |

### Другие
- `POST /api/upload/pdf` — загрузка PDF, генерация карточек через AI
- `GET /api/dictionary/define?word=` — определение слова (EN/RU)
- `GET /robots.txt`, `/sitemap.xml` — SEO
- `GET /healthcheck` — проверка работоспособности

---

## Ролевая модель (RBAC)

| Роль | Возможности |
|------|-------------|
| **guest** | Просмотр landing, вход/регистрация |
| **user** | CRUD своих колод, загрузка PDF, изучение |
| **admin** | Всё что user + просмотр всех колод, управление пользователями |

---

## Лабораторные работы

| ЛР | Тема | Реализация |
|----|------|------------|
| **ЛР 1** | RBAC: роли и права доступа | `app/routers/auth.py`, `PrivateRoute.jsx`, `Header.jsx` |
| **ЛР 2** | Аутентификация (access/refresh токены) | JWT в `app/core/security.py`, interceptors в `api.js` |
| **ЛР 3** | UI с фильтрацией и управлением данными | `MyDecks.jsx` (поиск, сортировка, пагинация), S3 storage |
| **ЛР 4** | SEO и сторонние API | `seo.py`, `dictionary_service.py`, `SEO.jsx` |
| **ЛР 5** | Комплексное тестирование | `backend/tests/`, `frontend/src/**/__tests__`, `e2e/` |
| **ЛР 6** | Контейнеризация и CI/CD | `Dockerfile`, `docker-compose.yml`, `.github/workflows/ci-cd.yml` |

---

## CI/CD Pipeline

GitHub Actions выполняет 3 job'а:

1. **Backend Tests** — `flake8` + `pytest` с coverage
2. **Frontend Tests** — `eslint` + `vitest`
3. **Docker Build** — сборка образов, `docker compose up`, smoke-тесты

Pipeline запускается на `push`/`pull_request` в ветки `main`, `master`, `develop`.

---

## Демо-данные

При первом запуске backend создаёт тестового администратора:

```
Email: admin@example.com
Password: admin123
```

---


