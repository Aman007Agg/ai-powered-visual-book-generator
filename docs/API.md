# API Documentation

Base URL (dev): `http://localhost:8000`
Interactive docs (Swagger UI): `http://localhost:8000/docs`
CORS: allows `http://localhost:4200`.

All responses are JSON. Errors use a consistent shape (see [Errors](#errors)).

---

## GET /

Health check.

**200 OK**
```json
{
  "status": "running",
  "message": "AI Powered Visual Book Generator Backend"
}
```

---

## POST /api/layout/generate

Generate two layout options for a single page.

### Request body — `GenerateLayoutRequest`

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `title` | string \| null | no | Optional book title (AI context) |
| `objective` | string \| null | no | Optional book objective/theme |
| `page_text` | string | **yes** | Page content. `min_length: 1` |
| `images` | `PageImage[]` | no | Defaults to `[]` |

`PageImage`:

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `fileName` | string | yes | Original file name |
| `mimeType` | string | yes | e.g. `image/png` |
| `base64` | string | yes | `min_length: 1` (data payload) |

**Example**
```json
{
  "title": "AI Fundamentals",
  "objective": "Teach beginners about Artificial Intelligence",
  "page_text": "Artificial Intelligence enables machines to learn from data...",
  "images": [
    { "fileName": "ai.png", "mimeType": "image/png", "base64": "data:image/png;base64,iVBOR..." }
  ]
}
```

### Response body — `GenerateLayoutResponse`

| Field | Type | Notes |
|-------|------|-------|
| `page_summary` | string | Short AI summary of the page |
| `layout_options` | `LayoutOption[]` | Exactly two, with **different** `layout_type` |

`LayoutOption`:

| Field | Type | Notes |
|-------|------|-------|
| `id` | string | e.g. `layout_1` |
| `layout_type` | string | one of `hero` \| `split` \| `magazine` |
| `layout_name` | string | Human label |
| `description` | string | One-line rationale |
| `confidence` | int | 0–100 |
| `sections` | `LayoutSection[]` | Ordered content |

`LayoutSection`:

| Field | Type | Notes |
|-------|------|-------|
| `type` | enum | `title` \| `paragraph` \| `image` |
| `text` | string \| null | for `title` / `paragraph` |
| `image_reference` | int \| null | 0-based index into `images` (`>= 0`) |

**200 OK (example)**
```json
{
  "page_summary": "Intro to Artificial Intelligence.",
  "layout_options": [
    {
      "id": "layout_1", "layout_type": "hero", "layout_name": "Hero Introduction",
      "description": "Lead image, then title and text.", "confidence": 96,
      "sections": [
        { "type": "image", "image_reference": 0 },
        { "type": "title", "text": "AI Fundamentals" },
        { "type": "paragraph", "text": "Artificial Intelligence enables..." }
      ]
    },
    {
      "id": "layout_2", "layout_type": "magazine", "layout_name": "Magazine Spread",
      "description": "Headline, image grid, dense body.", "confidence": 91,
      "sections": [
        { "type": "title", "text": "AI Fundamentals" },
        { "type": "image", "image_reference": 0 },
        { "type": "paragraph", "text": "Artificial Intelligence enables..." }
      ]
    }
  ]
}
```

---

## Errors

**422 Unprocessable Entity** — request validation (FastAPI/Pydantic), e.g. empty
`page_text`.

**Domain errors** use this shape:
```json
{ "detail": { "success": false, "error_code": "RATE_LIMIT", "message": "OpenAI rate limit exceeded." } }
```

| HTTP | `error_code` | Cause |
|------|--------------|-------|
| 401 | `INVALID_API_KEY` | OpenAI rejected the key |
| 402 | `INSUFFICIENT_CREDITS` | Quota/credits exhausted |
| 429 | `RATE_LIMIT` | Rate limited by OpenAI |
| 400 | `CONTEXT_LENGTH` | Input exceeds model context |
| 500 | `MISSING_API_KEY` | `OPENAI_API_KEY` not configured |
| 500 | `OPENAI_API_ERROR` | Other OpenAI/parse/validation failure |

The frontend `ApiService` retries once on transient failure before surfacing an
error.
