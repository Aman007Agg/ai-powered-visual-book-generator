import json
from unittest.mock import patch, MagicMock

from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)

VALID_RESPONSE = {
    "page_summary": "summary",
    "layout_options": [
        {"id": "layout_1", "layout_type": "hero", "layout_name": "Hero",
         "description": "d", "confidence": 95,
         "sections": [{"type": "title", "text": "T"}]},
        {"id": "layout_2", "layout_type": "split", "layout_name": "Split",
         "description": "d", "confidence": 90, "sections": []},
    ],
}


def _completion(content: str):
    """Build a minimal object shaped like an OpenAI chat completion."""
    message = MagicMock()
    message.content = content
    choice = MagicMock()
    choice.message = message
    resp = MagicMock()
    resp.choices = [choice]
    return resp


def test_health_endpoint():
    r = client.get("/")
    assert r.status_code == 200
    assert r.json()["status"] == "running"


@patch("app.services.openai_service.client")
def test_generate_happy_path(mock_client):
    mock_client.chat.completions.create.return_value = _completion(
        json.dumps(VALID_RESPONSE)
    )
    r = client.post("/api/layout/generate",
                    json={"page_text": "AI content", "images": []})
    assert r.status_code == 200
    body = r.json()
    assert len(body["layout_options"]) == 2
    assert body["layout_options"][0]["layout_type"] == "hero"


@patch("app.services.openai_service.client")
def test_generate_malformed_json_returns_500(mock_client):
    mock_client.chat.completions.create.return_value = _completion("this is not json {")
    r = client.post("/api/layout/generate",
                    json={"page_text": "x", "images": []})
    assert r.status_code == 500
    assert r.json()["detail"]["error_code"] == "OPENAI_API_ERROR"


@patch("app.services.openai_service.client")
def test_generate_invalid_shape_returns_500(mock_client):
    mock_client.chat.completions.create.return_value = _completion(
        json.dumps({"unexpected": "shape"})
    )
    r = client.post("/api/layout/generate",
                    json={"page_text": "x", "images": []})
    assert r.status_code == 500


def test_generate_empty_text_returns_422():
    # page_text has min_length=1 -> request validation fails before the service.
    r = client.post("/api/layout/generate",
                    json={"page_text": "", "images": []})
    assert r.status_code == 422
