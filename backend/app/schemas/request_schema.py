from pydantic import BaseModel, Field


class GenerateLayoutRequest(BaseModel):
    """
    Request payload received from the Angular application
    for generating page layout recommendations.
    """

    title: str | None = Field(
        default=None,
        description="Optional book title"
    )

    objective: str | None = Field(
        default=None,
        description="Optional book objective or theme"
    )

    page_text: str = Field(
        ...,
        min_length=1,
        description="Text content of the current page"
    )

    images: list[str] = Field(
        default_factory=list,
        description="List of uploaded image references"
    )