import copy
import pytest
from pydantic import ValidationError

from app.schemas.response_schema import GenerateLayoutResponse

VALID = {
    "page_summary": "summary",
    "layout_options": [
        {
            "id": "layout_1", "layout_type": "hero", "layout_name": "Hero",
            "description": "d", "confidence": 95,
            "sections": [
                {"type": "title", "text": "T"},
                {"type": "image", "image_reference": 0},
                {"type": "paragraph", "text": "p"},
            ],
        },
        {
            "id": "layout_2", "layout_type": "split", "layout_name": "Split",
            "description": "d", "confidence": 90, "sections": [],
        },
    ],
}


def test_valid_response_parses():
    resp = GenerateLayoutResponse.model_validate(VALID)
    assert len(resp.layout_options) == 2
    assert resp.layout_options[0].layout_type == "hero"


def test_confidence_out_of_range_rejected():
    bad = copy.deepcopy(VALID)
    bad["layout_options"][0]["confidence"] = 150
    with pytest.raises(ValidationError):
        GenerateLayoutResponse.model_validate(bad)


def test_missing_page_summary_rejected():
    bad = copy.deepcopy(VALID)
    del bad["page_summary"]
    with pytest.raises(ValidationError):
        GenerateLayoutResponse.model_validate(bad)


def test_negative_image_reference_rejected():
    bad = copy.deepcopy(VALID)
    bad["layout_options"][0]["sections"][1]["image_reference"] = -1
    with pytest.raises(ValidationError):
        GenerateLayoutResponse.model_validate(bad)


def test_invalid_section_type_rejected():
    bad = copy.deepcopy(VALID)
    bad["layout_options"][0]["sections"][0]["type"] = "footer"
    with pytest.raises(ValidationError):
        GenerateLayoutResponse.model_validate(bad)
