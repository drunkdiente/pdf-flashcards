import datetime
import app.db as db_module


class TestGetDecks:
    def test_user_sees_only_own_decks(self, client, user_token):
        # Подготовка: добавим колоду для user (id=1)
        db_module.fake_decks_db.append({
            "id": "d1",
            "owner_id": "1",
            "title": "User Deck",
            "description": "desc",
            "file_key": None,
            "file_name": None,
            "created_at": datetime.datetime.utcnow(),
            "cards": []
        })
        db_module.fake_decks_db.append({
            "id": "d2",
            "owner_id": "0",
            "title": "Admin Deck",
            "description": "desc",
            "file_key": None,
            "file_name": None,
            "created_at": datetime.datetime.utcnow(),
            "cards": []
        })

        response = client.get(
            "/api/decks/",
            headers={"Authorization": f"Bearer {user_token}"}
        )
        assert response.status_code == 200
        decks = response.json()
        assert len(decks) == 1
        assert decks[0]["title"] == "User Deck"

    def test_admin_sees_all_decks(self, client, admin_token):
        db_module.fake_decks_db.append({
            "id": "d3",
            "owner_id": "99",
            "title": "Other Deck",
            "description": "desc",
            "file_key": None,
            "file_name": None,
            "created_at": datetime.datetime.utcnow(),
            "cards": []
        })

        response = client.get(
            "/api/decks/",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 200
        decks = response.json()
        assert len(decks) == 1
        assert decks[0]["title"] == "Other Deck"

    def test_search_filter(self, client, user_token):
        db_module.fake_decks_db.append({
            "id": "d4",
            "owner_id": "1",
            "title": "Python Basics",
            "description": "Learn Python",
            "file_key": None,
            "file_name": None,
            "created_at": datetime.datetime.utcnow(),
            "cards": []
        })

        response = client.get(
            "/api/decks/?search=python",
            headers={"Authorization": f"Bearer {user_token}"}
        )
        assert response.status_code == 200
        decks = response.json()
        assert len(decks) == 1

    def test_pagination(self, client, user_token):
        for i in range(5):
            db_module.fake_decks_db.append({
                "id": f"pag{i}",
                "owner_id": "1",
                "title": f"Deck {i}",
                "description": "",
                "file_key": None,
                "file_name": None,
                "created_at": datetime.datetime.utcnow(),
                "cards": []
            })

        response = client.get(
            "/api/decks/?skip=2&limit=2",
            headers={"Authorization": f"Bearer {user_token}"}
        )
        assert response.status_code == 200
        decks = response.json()
        assert len(decks) == 2


class TestCreateDeck:
    def test_create_deck(self, client, user_token):
        payload = {
            "title": "New Deck",
            "description": "Test description",
            "cards": [
                {"question": "Q1", "answer": "A1"}
            ]
        }
        response = client.post(
            "/api/decks/",
            json=payload,
            headers={"Authorization": f"Bearer {user_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["title"] == "New Deck"
        assert data["owner_id"] == "1"
        assert len(data["cards"]) == 1

    def test_create_deck_unauthorized(self, client):
        response = client.post("/api/decks/", json={"title": "X"})
        assert response.status_code == 401


class TestGetDeck:
    def test_get_own_deck(self, client, user_token):
        db_module.fake_decks_db.append({
            "id": "d5",
            "owner_id": "1",
            "title": "Own",
            "description": "",
            "file_key": None,
            "file_name": None,
            "created_at": datetime.datetime.utcnow(),
            "cards": []
        })

        response = client.get(
            "/api/decks/d5",
            headers={"Authorization": f"Bearer {user_token}"}
        )
        assert response.status_code == 200
        assert response.json()["title"] == "Own"

    def test_get_other_deck_forbidden(self, client, user_token):
        db_module.fake_decks_db.append({
            "id": "d6",
            "owner_id": "99",
            "title": "Foreign",
            "description": "",
            "file_key": None,
            "file_name": None,
            "created_at": datetime.datetime.utcnow(),
            "cards": []
        })

        response = client.get(
            "/api/decks/d6",
            headers={"Authorization": f"Bearer {user_token}"}
        )
        assert response.status_code == 403


class TestDeleteDeck:
    def test_delete_own_deck(self, client, user_token):
        db_module.fake_decks_db.append({
            "id": "d7",
            "owner_id": "1",
            "title": "ToDelete",
            "description": "",
            "file_key": None,
            "file_name": None,
            "created_at": datetime.datetime.utcnow(),
            "cards": []
        })

        response = client.delete(
            "/api/decks/d7",
            headers={"Authorization": f"Bearer {user_token}"}
        )
        assert response.status_code == 204

    def test_delete_other_deck_forbidden(self, client, user_token):
        db_module.fake_decks_db.append({
            "id": "d8",
            "owner_id": "99",
            "title": "Protected",
            "description": "",
            "file_key": None,
            "file_name": None,
            "created_at": datetime.datetime.utcnow(),
            "cards": []
        })

        response = client.delete(
            "/api/decks/d8",
            headers={"Authorization": f"Bearer {user_token}"}
        )
        assert response.status_code == 403
