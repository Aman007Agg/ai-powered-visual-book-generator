from fastapi import FastAPI

from app.api.health import router as health_router
from app.api.layout import router as layout_router

app = FastAPI(
    title="AI Powered Visual Book Generator API",
    description="Backend API for EY GenAI Assignment MVP",
    version="1.0.0"
)

app.include_router(health_router)
app.include_router(layout_router)