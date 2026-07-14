import json
import os

from dotenv import load_dotenv
from openai import (
    OpenAI,
    AuthenticationError,
    RateLimitError,
    APIConnectionError,
    APITimeoutError,
    APIError,
    BadRequestError,
)

from app.core.exceptions import (
    MissingAPIKeyException,
    InvalidAPIKeyException,
    InsufficientCreditsException,
    RateLimitException,
    ContextLengthException,
    OpenAIAPIException,
)

from app.prompts.layout_prompt import (
    SYSTEM_PROMPT,
    build_user_prompt,
)

from app.schemas.request_schema import GenerateLayoutRequest
from app.schemas.response_schema import GenerateLayoutResponse

# ---------------------------------------------------------
# Load Environment Variables
# ---------------------------------------------------------

load_dotenv()

api_key = os.getenv("OPENAI_API_KEY")

if not api_key:
    raise MissingAPIKeyException()

MODEL_NAME = os.getenv("OPENAI_MODEL", "gpt-4.1")

client = OpenAI(api_key=api_key)


# ---------------------------------------------------------
# OpenAI Service
# ---------------------------------------------------------

class OpenAIService:
    """
    Handles all communication with the OpenAI API.
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
            image_count=len(request.images),
        )

        try:

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

            validated_response = (
                GenerateLayoutResponse.model_validate(
                    response_data
                )
            )

            return validated_response.model_dump()

        except AuthenticationError:
            raise InvalidAPIKeyException()

        except RateLimitError as ex:

            message = str(ex).lower()

            if (
                "insufficient_quota" in message
                or "insufficient quota" in message
                or "quota" in message
            ):
                raise InsufficientCreditsException()

            raise RateLimitException()

        except BadRequestError as ex:

            message = str(ex).lower()

            if (
                "context_length" in message
                or "maximum context length" in message
                or "context" in message
            ):
                raise ContextLengthException()

            raise OpenAIAPIException(str(ex))

        except APITimeoutError:
            raise OpenAIAPIException(
                "OpenAI request timed out."
            )

        except APIConnectionError:
            raise OpenAIAPIException(
                "Unable to connect to OpenAI."
            )

        except APIError as ex:
            raise OpenAIAPIException(str(ex))

        except Exception as ex:
            raise OpenAIAPIException(str(ex))