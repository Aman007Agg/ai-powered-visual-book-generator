from fastapi import HTTPException


class OpenAIAPIException(HTTPException):
    def __init__(self, message: str):
        super().__init__(
            status_code=500,
            detail={
                "success": False,
                "error_code": "OPENAI_API_ERROR",
                "message": message
            }
        )


class MissingAPIKeyException(HTTPException):
    def __init__(self):
        super().__init__(
            status_code=500,
            detail={
                "success": False,
                "error_code": "MISSING_API_KEY",
                "message": "OPENAI_API_KEY is missing."
            }
        )


class InvalidAPIKeyException(HTTPException):
    def __init__(self):
        super().__init__(
            status_code=401,
            detail={
                "success": False,
                "error_code": "INVALID_API_KEY",
                "message": "OpenAI API Key is invalid."
            }
        )


class InsufficientCreditsException(HTTPException):
    def __init__(self):
        super().__init__(
            status_code=402,
            detail={
                "success": False,
                "error_code": "INSUFFICIENT_CREDITS",
                "message": "OpenAI account has insufficient credits."
            }
        )


class RateLimitException(HTTPException):
    def __init__(self):
        super().__init__(
            status_code=429,
            detail={
                "success": False,
                "error_code": "RATE_LIMIT",
                "message": "OpenAI rate limit exceeded."
            }
        )


class ContextLengthException(HTTPException):
    def __init__(self):
        super().__init__(
            status_code=400,
            detail={
                "success": False,
                "error_code": "CONTEXT_LENGTH",
                "message": "Input exceeds model context length."
            }
        )