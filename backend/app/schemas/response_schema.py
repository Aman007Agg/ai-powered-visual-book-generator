from enum import Enum

from pydantic import BaseModel, Field


# ---------------------------------------------------------
# Enums
# ---------------------------------------------------------

class ElementType(str, Enum):
    """
    Supported renderable element types for MVP.
    """

    TITLE = "title"
    PARAGRAPH = "paragraph"
    IMAGE = "image"


class Alignment(str, Enum):
    """
    Horizontal alignment.
    """

    LEFT = "left"
    CENTER = "center"
    RIGHT = "right"


class FontSize(str, Enum):
    """
    Relative font sizes.
    """

    SMALL = "small"
    MEDIUM = "medium"
    LARGE = "large"


class Emphasis(str, Enum):
    """
    Text emphasis.
    """

    NORMAL = "normal"
    BOLD = "bold"


# ---------------------------------------------------------
# Canvas
# ---------------------------------------------------------

class Canvas(BaseModel):
    """
    Logical page grid.
    """

    width: int = Field(default=12, ge=1)
    height: int = Field(default=12, ge=1)


# ---------------------------------------------------------
# Position
# ---------------------------------------------------------

class ElementPosition(BaseModel):
    """
    Grid position of an element.
    """

    x: int = Field(ge=0)
    y: int = Field(ge=0)
    w: int = Field(gt=0)
    h: int = Field(gt=0)


# ---------------------------------------------------------
# Style
# ---------------------------------------------------------

class ElementStyle(BaseModel):
    """
    Rendering hints for Angular.
    """

    alignment: Alignment | None = None
    font_size: FontSize | None = None
    emphasis: Emphasis | None = None
    padding: int | None = Field(default=None, ge=0)


# ---------------------------------------------------------
# Content
# ---------------------------------------------------------

class ElementContent(BaseModel):
    """
    Content rendered by the element.
    """

    text: str | None = None
    image_reference: int | None = Field(default=None, ge=0)


# ---------------------------------------------------------
# Layout Element
# ---------------------------------------------------------

class LayoutElement(BaseModel):
    """
    A single renderable page element.
    """

    id: str

    type: ElementType

    content: ElementContent

    position: ElementPosition

    style: ElementStyle = Field(default_factory=ElementStyle)


# ---------------------------------------------------------
# Layout Option
# ---------------------------------------------------------

class LayoutOption(BaseModel):
    """
    One AI-generated layout option.
    """

    id: str

    name: str

    description: str

    confidence: int = Field(ge=0, le=100)

    canvas: Canvas

    elements: list[LayoutElement]


# ---------------------------------------------------------
# Response
# ---------------------------------------------------------

class GenerateLayoutResponse(BaseModel):
    """
    Response returned to Angular.
    """

    page_summary: str

    layout_options: list[LayoutOption]