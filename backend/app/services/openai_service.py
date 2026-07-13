import json
import os

from dotenv import load_dotenv
from openai import OpenAI

from app.prompts.layout_prompt import (
    SYSTEM_PROMPT,
    build_user_prompt,
)
from app.schemas.request_schema import GenerateLayoutRequest

from app.schemas.response_schema import GenerateLayoutResponse

# Load environment variables
load_dotenv()

client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY")
)

MODEL_NAME = os.getenv("OPENAI_MODEL", "gpt-4.1")


class OpenAIService:
    """
    Handles communication with the OpenAI API.
    """

    @staticmethod
    def generate_layout(
        request: GenerateLayoutRequest,
    ) -> dict:
        """
        Generate layout recommendations for a book page.
        """

        user_prompt = build_user_prompt(
            title=request.title,
            objective=request.objective,
            page_text=request.page_text,
        )

        response = client.chat.completions.create(
            model=MODEL_NAME,
            response_format={
                "type": "json_object"
            },
            messages=[
                {
                    "role": "system",
                    "content": SYSTEM_PROMPT,
                },
                {
                    "role": "user",
                    "content": user_prompt,
                },
            ],
            temperature=0.5,
        )
        
        response_data = json.loads(
            response.choices[0].message.content
        )

        validated_response = GenerateLayoutResponse.model_validate(
            response_data
        )

        return validated_response.model_dump()