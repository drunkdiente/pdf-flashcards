class TestRegister:
    def test_register_success(self, client):
        response = client.post(
            "/api/auth/register",
            json={"email": "tester@example.com", "password": "testpass123"}
        )
        assert response.status_code == 201
        assert response.json()["message"] == "User created successfully"

    def test_register_duplicate(self, client):
        response = client.post(
            "/api/auth/register",
            json={"email": "user@example.com", "password": "testpass123"}
        )
        assert response.status_code == 400

    def test_register_invalid_email(self, client):
        response = client.post(
            "/api/auth/register",
            json={"email": "not-an-email", "password": "short"}
        )
        assert response.status_code == 422


class TestLogin:
    def test_login_success(self, client):
        response = client.post(
            "/api/auth/login",
            data={"username": "admin@example.com", "password": "admin123"}
        )
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"
        assert data["role"] == "admin"
        assert "refresh_token" in response.cookies

    def test_login_wrong_password(self, client):
        response = client.post(
            "/api/auth/login",
            data={"username": "admin@example.com", "password": "wrong"}
        )
        assert response.status_code == 401

    def test_login_user_not_found(self, client):
        response = client.post(
            "/api/auth/login",
            data={"username": "ghost@example.com", "password": "pass"}
        )
        assert response.status_code == 401


class TestRefresh:
    def test_refresh_success(self, client):
        from app.core.security import create_refresh_token
        refresh_token = create_refresh_token("user@example.com")

        response = client.post(
            "/api/auth/refresh",
            cookies={"refresh_token": refresh_token}
        )
        assert response.status_code == 200
        assert "access_token" in response.json()

    def test_refresh_missing_cookie(self, client):
        response = client.post("/api/auth/refresh")
        assert response.status_code == 401


class TestMe:
    def test_me_success(self, client, user_token):
        response = client.get(
            "/api/auth/me",
            headers={"Authorization": f"Bearer {user_token}"}
        )
        assert response.status_code == 200
        assert response.json()["email"] == "user@example.com"

    def test_me_unauthorized(self, client):
        response = client.get("/api/auth/me")
        assert response.status_code == 401


class TestLogout:
    def test_logout_success(self, client, user_token):
        response = client.post(
            "/api/auth/logout",
            headers={"Authorization": f"Bearer {user_token}"}
        )
        assert response.status_code == 200
        # После logout токен должен быть в blacklist
        me_resp = client.get(
            "/api/auth/me",
            headers={"Authorization": f"Bearer {user_token}"}
        )
        assert me_resp.status_code == 401


class TestAdminEndpoints:
    def test_get_users_as_admin(self, client, admin_token):
        response = client.get(
            "/api/auth/users",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 200
        assert isinstance(response.json(), list)

    def test_get_users_as_user_forbidden(self, client, user_token):
        response = client.get(
            "/api/auth/users",
            headers={"Authorization": f"Bearer {user_token}"}
        )
        assert response.status_code == 403
