from app.core.security import get_password_hash

# Имитация базы данных в памяти

# Добавляем поле role и создаем админа по умолчанию
# admin@example.com / admin123
fake_users_db = {
    "admin@example.com": {
        "id": "0",
        "email": "admin@example.com",
        "hashed_password": get_password_hash("admin123"),
        "role": "admin"
    }
}

# Добавляем owner_id к колодам, чтобы знать, чьи они
fake_decks_db = [
    {
        "id": "1",
        "owner_id": "0", # Принадлежит админу
        "title": "История России",
        "description": "Даты и события 19 века",
        "cards": [
            {"id": "c1", "question": "Дата отмены крепостного права?", "answer": "1861 год"},
            {"id": "c2", "question": "Кто правил после Николая I?", "answer": "Александр II"}
        ]
    },
    {
        "id": "2",
        "owner_id": "999", # Принадлежит кому-то другому
        "title": "Английские фразы",
        "description": "Базовый уровень",
        "cards": []
    }
]

blacklist_db = set()