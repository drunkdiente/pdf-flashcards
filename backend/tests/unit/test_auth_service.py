import pytest
from fastapi import HTTPException

from app.services.auth_service import AuthService
from app.repositories.user_repository import UserRepository
from app.schemas import UserAuth


@pytest.fixture
def auth_service():
    repo = UserRepository()
    return AuthService(user_repository=repo)


class TestAuthenticateUser:
    def test_success(self, auth_service):
        user = auth_service.authenticate_user("admin@example.com", "admin123")
        assert user["email"] == "admin@example.com"

    def test_wrong_password(self, auth_service):
        with pytest.raises(HTTPException) as exc_info:
            auth_service.authenticate_user("admin@example.com", "wrong")
        assert exc_info.value.status_code == 401

    def test_user_not_found(self, auth_service):
        with pytest.raises(HTTPException) as exc_info:
            auth_service.authenticate_user("nobody@example.com", "pass")
        assert exc_info.value.status_code == 401


class TestRegisterUser:
    def test_success(self, auth_service):
        user_data = UserAuth(email="new@example.com", password="newpass123")
        user = auth_service.register_user(user_data)
        assert user["email"] == "new@example.com"
        assert user["role"] == "user"

    def test_duplicate_email(self, auth_service):
        user_data = UserAuth(email="admin@example.com", password="admin123")
        with pytest.raises(HTTPException) as exc_info:
            auth_service.register_user(user_data)
        assert exc_info.value.status_code == 400


class TestRefreshToken:
    def test_valid_refresh(self, auth_service):
        from app.core.security import create_refresh_token
        token = create_refresh_token("admin@example.com")
        access_token, user = auth_service.refresh_token(token)
        assert access_token is not None
        assert user["email"] == "admin@example.com"

    def test_invalid_refresh(self, auth_service):
        with pytest.raises(HTTPException) as exc_info:
            auth_service.refresh_token("invalid.token.here")
        assert exc_info.value.status_code == 401


class TestGetCurrentUserFromToken:
    def test_valid_token(self, auth_service):
        from app.core.security import create_access_token
        token = create_access_token("admin@example.com")
        user = auth_service.get_current_user_from_token(token)
        assert user["email"] == "admin@example.com"

    def test_blacklisted_token(self, auth_service):
        from app.core.security import create_access_token
        token = create_access_token("admin@example.com")
        auth_service.logout(token)
        with pytest.raises(HTTPException) as exc_info:
            auth_service.get_current_user_from_token(token)
        assert exc_info.value.status_code == 401
