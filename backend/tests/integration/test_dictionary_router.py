import pytest
from unittest.mock import AsyncMock, patch


class TestDefineWord:
    @patch("app.services.dictionary_service.httpx.AsyncClient.get")
    def test_define_english_word(self, mock_get, client):
        mock_get.return_value.status_code = 200
        mock_get.return_value.raise_for_status = lambda: None
        mock_get.return_value.json = lambda: [
            {
                "meanings": [
                    {"definitions": [{"definition": "A greeting"}]}
                ]
            }
        ]

        response = client.get("/api/dictionary/define?word=hello")
        assert response.status_code == 200
        data = response.json()
        assert data["found"] is True
        assert "greeting" in data["definition"]

    @patch("app.services.dictionary_service.httpx.AsyncClient.get")
    def test_define_word_not_found(self, mock_get, client):
        mock_get.return_value.status_code = 404
        mock_get.return_value.raise_for_status = lambda: None
        mock_get.return_value.json = lambda: {}

        response = client.get("/api/dictionary/define?word=xyzxyz")
        assert response.status_code == 200
        data = response.json()
        assert data["found"] is False

    @patch("app.services.dictionary_service.httpx.AsyncClient.get", new_callable=AsyncMock)
    def test_define_external_error(self, mock_get, client):
        from httpx import HTTPStatusError, Request, Response
        request = Request("GET", "http://test")
        mock_get.side_effect = HTTPStatusError(
            "Server error", request=request, response=Response(500, request=request)
        )

        response = client.get("/api/dictionary/define?word=error")
        assert response.status_code == 502
