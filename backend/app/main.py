from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.health import router as health_router
from app.api.layout import router as layout_router

app = FastAPI(
    title="AI Powered Visual Book Generator API",
    description="Backend API for EY GenAI Assignment MVP",
    version="1.0.0"
)

# ---------------------------------------------------------
# CORS Configuration
# ---------------------------------------------------------
# Allows the Angular application running on localhost:4200
# to communicate with this FastAPI backend.
# ---------------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:4200"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------
# Register API Routers
# ---------------------------------------------------------

app.include_router(health_router)
app.include_router(layout_router)