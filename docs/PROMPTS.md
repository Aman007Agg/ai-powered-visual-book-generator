# Prompt Documentation

Prompts are treated as production software: versioned, structured, and paired
with a validated output schema. Source: `backend/app/prompts/layout_prompt.py`.

## Design goals

- Make the model an **editorial layout decision-maker**, not an HTML generator.
- Force **structured JSON** we can validate and render deterministically.
- Guarantee the two options are **genuinely different** (so the "two options"
  UX is meaningful).

## System prompt (fixed)

Establishes:
- **Role:** expert editorial book-layout designer.
- **Goal:** analyze content and produce **exactly two** layout recommendations.
- **Boundaries:** do **not** produce HTML/CSS/coordinates; decide only *which
  layout*, *section order*, and *which image goes where*.
- **Constraints:**
  - `layout_type` ∈ { `hero`, `split`, `magazine` }.
  - The two options **must use two different** `layout_type`s (no cosmetic
    duplicates).
  - Genuinely different arrangements (order/grouping), not restyles.
  - `confidence` is an integer 0–100; the two should differ.
  - `image_reference` is 0-based and must be `< number of uploaded images`;
    if zero images, include no image sections.
- **Per-type guidance:** hero (one strong lead image), split (image/text side by
  side), magazine (headline + image cluster + dense body).
- **Output:** valid JSON only — no markdown, no prose.

## User prompt (dynamic) — `build_user_prompt(...)`

Interpolates the request context:
```
Book Title:      {title | "Not Provided"}
Book Objective:  {objective | "Not Provided"}
Uploaded Images: {image_count}
Page Content:    {page_text}
```
…and restates the key constraints (two different `layout_type`s; never use an
`image_reference` ≥ `image_count`).

## Output schema (contract)

The model must return the shape documented in [API.md](API.md)
(`page_summary` + two `layout_options`, each with `sections`). This is enforced
two ways:
1. **Transport:** `response_format={"type": "json_object"}` on the OpenAI call.
2. **Validation:** `GenerateLayoutResponse.model_validate(...)` (Pydantic) —
   invalid shape, out-of-range `confidence`, negative `image_reference`, or an
   unknown section `type` all raise and are mapped to a clean error.

This validation layer is the safety net: a bad model response fails validation
rather than reaching the UI.

## Model & parameters

- Model: `OPENAI_MODEL` env (default `gpt-4.1`).
- `temperature = 0.5` — enough variety for two distinct options, still stable.
- No `max_tokens`/timeout yet — documented as deferred hardening
  ([ASSUMPTIONS.md](ASSUMPTIONS.md), A6).

## Known limitation — vision

The system prompt speaks of "analyzing images," but image **content** is not
currently sent to the model — only the **count** (see [ASSUMPTIONS.md](ASSUMPTIONS.md),
A1). Upgrade path: add GPT-4o `image_url` content blocks so the model sees the
images. The prompt and schema already accommodate this.

## Trade-offs / interview notes

- **JSON-object mode + schema validation** trades a little prompting freedom for
  robustness and safety — the right call for a UI-driving contract.
- **Forcing two different types** guarantees a meaningful choice for the user and
  showcases "context-aware, not static" behavior (PRD §9).
- **Prompt injection**: user `page_text` is interpolated; impact is bounded
  because output must pass the schema — a malicious instruction can at most
  produce a differently-shaped-but-rejected response, not execute anything.
