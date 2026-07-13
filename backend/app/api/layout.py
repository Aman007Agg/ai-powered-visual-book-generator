from fastapi import APIRouter

from app.schemas.request_schema import (
    GenerateLayoutRequest
)
from app.services.openai_service import (
    OpenAIService
)

router = APIRouter(
    prefix="/api/layout",
    tags=["Layout"]
)


@router.post("/generate")
def generate_layout(
    request: GenerateLayoutRequest
):
    return OpenAIService.generate_layout(
        request
    )