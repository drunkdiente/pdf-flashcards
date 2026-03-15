from app.db import fake_users_db, blacklist_db

class UserRepository:
    def get_by_email(self, email: str):
        return fake_users_db.get(email)

    def create(self, user_data: dict):
        fake_users_db[user_data["email"]] = user_data
        return user_data

    def get_all(self):
        return list(fake_users_db.values())

    def email_exists(self, email: str) -> bool:
        return email in fake_users_db

    def add_to_blacklist(self, token: str):
        blacklist_db.add(token)

    def is_blacklisted(self, token: str) -> bool:
        return token in blacklist_db
