from fastapi import APIRouter

router = APIRouter(
    tags=["Health"]
)


@router.get("/")
def health():
    return {
        "status": "running",
        "message": "AI Powered Visual Book Generator Backend"
    }