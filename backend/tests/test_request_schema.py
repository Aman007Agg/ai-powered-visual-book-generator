import pytest
from pydantic import ValidationError

from app.schemas.request_schema import GenerateLayoutRequest, PageImage


def test_minimal_valid_request_text_only():
    req = GenerateLayoutRequest(page_text="Hello")
    assert req.page_text == "Hello"
    assert req.images == []
    assert req.title is None
    assert req.objective is None


def test_empty_page_text_rejected():
    with pytest.raises(ValidationError):
        GenerateLayoutRequest(page_text="")


def test_page_text_required():
    with pytest.raises(ValidationError):
        GenerateLayoutRequest()


def test_request_with_image():
    req = GenerateLayoutRequest(
        page_text="x",
        images=[PageImage(fileName="a.png", mimeType="image/png", base64="data")],
    )
    assert len(req.images) == 1
    assert req.images[0].fileName == "a.png"


def test_image_requires_non_empty_base64():
    with pytest.raises(ValidationError):
        PageImage(fileName="a.png", mimeType="image/png", base64="")
