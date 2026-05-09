import pytest
from datetime import timedelta
from jose import jwt

from app.core.security import (
    verify_password,
    get_password_hash,
    create_access_token,
    create_refresh_token,
    decode_token,
    SECRET_KEY,
    ALGORITHM,
)


class TestPasswordHashing:
    def test_hash_and_verify(self):
        password = "supersecret"
        hashed = get_password_hash(password)
        assert verify_password(password, hashed) is True

    def test_verify_wrong_password(self):
        password = "supersecret"
        hashed = get_password_hash(password)
        assert verify_password("wrongpassword", hashed) is False


class TestTokenCreation:
    def test_create_access_token(self):
        token = create_access_token("user@example.com")
        payload = decode_token(token)
        assert payload is not None
        assert payload["sub"] == "user@example.com"
        assert payload["type"] == "access"
        assert "exp" in payload

    def test_create_refresh_token(self):
        token = create_refresh_token("user@example.com")
        payload = decode_token(token)
        assert payload is not None
        assert payload["sub"] == "user@example.com"
        assert payload["type"] == "refresh"

    def test_decode_invalid_token(self):
        assert decode_token("totally.invalid.token") is None
