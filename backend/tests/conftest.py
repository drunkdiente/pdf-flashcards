import pytest
from fastapi.testclient import TestClient
import app.db as db_module
from main import app
from app.core.security import get_password_hash, create_access_token


@pytest.fixture(autouse=True)
def reset_db():
    """Сбрасывает in-memory БД перед каждым тестом."""
    db_module.fake_users_db.clear()
    db_module.fake_decks_db.clear()
    db_module.blacklist_db.clear()

    # Создаем тестовых пользователей
    db_module.fake_users_db["admin@example.com"] = {
        "id": "0",
        "email": "admin@example.com",
        "hashed_password": get_password_hash("admin123"),
        "role": "admin"
    }
    db_module.fake_users_db["user@example.com"] = {
        "id": "1",
        "email": "user@example.com",
        "hashed_password": get_password_hash("user123"),
        "role": "user"
    }

    yield

    # Очистка после теста
    db_module.fake_users_db.clear()
    db_module.fake_decks_db.clear()
    db_module.blacklist_db.clear()


@pytest.fixture
def client():
    """Синхронный TestClient для FastAPI."""
    with TestClient(app) as c:
        yield c


@pytest.fixture
def admin_token():
    """Генерирует access_token для администратора напрямую."""
    return create_access_token("admin@example.com")


@pytest.fixture
def user_token():
    """Генерирует access_token для обычного пользователя напрямую."""
    return create_access_token("user@example.com")
