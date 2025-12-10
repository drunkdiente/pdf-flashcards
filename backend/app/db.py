# Имитация базы данных в памяти
# В будущем здесь будет подключение к реальной БД (Postgres/Mongo)

fake_decks_db = [
    {
        "id": "1",
        "title": "История России",
        "description": "Даты и события 19 века",
        "cards": [
            {"id": "c1", "question": "Дата отмены крепостного права?", "answer": "1861 год"},
            {"id": "c2", "question": "Кто правил после Николая I?", "answer": "Александр II"}
        ]
    },
    {
        "id": "2",
        "title": "Английские фразы",
        "description": "Базовый уровень",
        "cards": []
    }
]

fake_users_db = {}

blacklist_db = set()