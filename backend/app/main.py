from fastapi import FastAPI

app = FastAPI(
    title="AI Powered Visual Book Generator API",
    description="Backend API for EY GenAI Assignment MVP",
    version="1.0.0"
)


@app.get("/")
def health():
    return {
        "status": "running",
        "message": "AI Powered Visual Book Generator Backend"
    }