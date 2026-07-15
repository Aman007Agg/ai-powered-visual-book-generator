import os

# The OpenAI client is constructed at import time in app.services.openai_service,
# which requires OPENAI_API_KEY. Set a dummy key BEFORE any test imports the app.
# (The client is never actually called during tests — it is mocked.)
os.environ.setdefault("OPENAI_API_KEY", "test-key-not-real")
