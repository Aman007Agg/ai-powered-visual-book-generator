from pydantic import BaseModel, Field


class LayoutOption(BaseModel):
    """
    Represents a single layout recommendation.
    """

    id: str

    layout_name: str

    description: str

    confidence: int = Field(
        ge=0,
        le=100
    )


class GenerateLayoutResponse(BaseModel):
    """
    Response returned to Angular.
    """

    page_summary: str

    recommended_layout: str

    layouts: list[LayoutOption]