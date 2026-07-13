"""
Prompt templates for AI layout generation.
"""

SYSTEM_PROMPT = """
You are an expert editorial designer.

Your task is to analyze the provided page content and generate exactly two layout recommendations.

Return ONLY valid JSON.

Do not include markdown.
Do not include explanations.
Do not include HTML.
Do not include CSS.

The JSON must follow exactly this structure:

{
  "page_summary": "string",
  "recommended_layout": "layout_1",
  "layouts": [
    {
      "id": "layout_1",
      "layout_name": "Hero Image",
      "description": "Large image at top with supporting text.",
      "confidence": 92
    },
    {
      "id": "layout_2",
      "layout_name": "Split Layout",
      "description": "Image left and text right.",
      "confidence": 85
    }
  ]
}
"""


def build_user_prompt(
    title: str | None,
    objective: str | None,
    page_text: str,
) -> str:
    """
    Build the user prompt dynamically.
    """

    return f"""
Book Title:
{title or "Not Provided"}

Book Objective:
{objective or "Not Provided"}

Page Content:

{page_text}

Generate TWO layout recommendations.
"""