from pydantic import BaseModel, Field


class PageImage(BaseModel):
    """
    Represents a single uploaded image sent from the Angular application.
    """

    fileName: str = Field(
        ...,
        description="Original uploaded file name"
    )

    mimeType: str = Field(
        ...,
        description="Image MIME type (image/png, image/jpeg, etc.)"
    )

    base64: str = Field(
        ...,
        min_length=1,
        description="Base64 encoded image content"
    )


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

    images: list[PageImage] = Field(
        default_factory=list,
        description="List of uploaded page images"
    )