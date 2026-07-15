# SDLC Phase 8 — Testing, Validation & Optimization

**Role:** Senior QA Engineer + Software Architect
**Scope:** Critical review of the whole MVP (Angular + FastAPI + Prompt), a test
plan, edge cases, security/performance findings, and a production-readiness
checklist. No behavioural changes are made in this document — it is the review
and the plan we execute next, in agreed increments.

Every finding is tagged with **Severity** (High / Medium / Low) and **Scope**
(MVP = fix before submission · NTH = nice-to-have · Future = out of MVP scope).

---

## 1. Test Strategy (and why)

We follow the classic **test pyramid**: many fast unit tests, fewer integration
tests, minimal end-to-end.

- **Unit (most value here):** pure, deterministic logic — `groupSections()`,
  `ImageRefPipe`, `BookStateService`, and backend Pydantic schemas /
  `build_user_prompt`. These have no I/O, so they are fast, stable, and cheap to
  maintain.
- **Integration:** the FastAPI `/api/layout/generate` route with the OpenAI call
  **mocked** (we never hit the real API in tests — deterministic + free), and an
  Angular component test that the workflow wiring (state → navigation) holds.
- **E2E:** out of scope for the MVP (PRD asks for a prototype). Documented as
  Future (Playwright/Cypress).

**Why this split?** The layout *intelligence* lives in the LLM (non-deterministic
— you cannot unit-test "is this a good layout"). So we test the deterministic
seams around it: schema validation, prompt construction, JSON→render mapping,
and state transitions. That is exactly the value of separating rendering from AI
generation (Phase 7) — it made the system testable.

**Tooling:** Angular = Jasmine/Karma (already configured). Backend = `pytest`
with `fastapi.testclient` + `unittest.mock` for the OpenAI client.

---

## 2. Critical Code Review — Findings

### 2.1 Functionality / Correctness

| # | Finding | Severity | Scope |
|---|---------|----------|-------|
| F1 | **Vision is not actually wired.** `openai_service` receives image base64 but only passes `image_count` into the prompt — no `image_url` content blocks are sent to the model. The AI decides layout from text + *number* of images, never their content. This undercuts the "Vision Support" claim and PRD §9 "context-aware layout decisions" (for images). | **High** | MVP decision needed |
| F2 | **`image_reference` is not bounds-checked server-side.** Schema allows any `>= 0`; the model could return an index ≥ image count. Frontend `ImageRefPipe` degrades to an empty `src` (broken `<img>`). | Medium | MVP |
| F3 | **No `max_tokens` / no explicit client timeout** on the OpenAI call. A large page or a hung connection can inflate cost or block a worker thread. `APITimeoutError` is *handled* but no timeout is *set*. | Medium | MVP |
| F4 | State is in-memory only (refresh loses the book). | Low | Future (PRD §6 explicitly: "no persistent storage required") |

### 2.2 Error Handling

| # | Finding | Severity | Scope |
|---|---------|----------|-------|
| E1 | **`MissingAPIKeyException` is raised at import time.** It is an `HTTPException` thrown outside any request → it crashes app startup with a stack trace instead of a clean error. Should fail fast with a plain, logged startup error (or lazy-init the client). | Medium | MVP |
| E2 | **Frontend uses `alert()`** for errors and validation. Works, but not production UX and not accessible. Replace with a Material `MatSnackBar` service. | Low | NTH |
| E3 | **No backend logging.** Failures vanish (no request id, no stack context). Even minimal `logging` on the OpenAI call boundary would help debugging and demos. | Medium | MVP (cheap) |
| E4 | Frontend retries once (good); **backend has no retry.** Acceptable given the frontend retry, but worth a note. | Low | NTH |

### 2.3 Security

| # | Finding | Severity | Scope |
|---|---------|----------|-------|
| S1 | **No image size/count limit.** A user can attach very large base64 images; the payload is held in memory and (once vision is on) becomes token cost. Add a per-image size cap + max image count, validated client and server side. | Medium | MVP |
| S2 | **Prompt injection surface.** `page_text` is interpolated into the user prompt; a user could embed "ignore instructions…". Impact is bounded because output is forced through `response_format=json_object` + Pydantic validation (a bad response fails validation rather than executing anything). Worth stating explicitly. | Low | NTH (document) |
| S3 | **XSS is well-handled** ✅. AI text is rendered via Angular interpolation (`{{ }}`), which auto-escapes; we never use `innerHTML`. Call this out as a deliberate strength. | — | ✅ |
| S4 | CORS is locked to `localhost:4200` (fine for dev). Production needs env-driven origins; `allow_methods/headers=*` should be tightened. | Low | Future |
| S5 | API key is read from env via `.env` (not committed) ✅. Ensure `.env` stays git-ignored. | — | ✅ verify |

### 2.4 Performance / Scalability

| # | Finding | Severity | Scope |
|---|---------|----------|-------|
| P1 | **PRD §8 target: ~500 pages.** Current design processes **one page per request**, which is the right way to stay inside LLM context limits ✅. No batching/summarization needed for MVP, but document it as the deliberate strategy. | — | ✅ (document) |
| P2 | Base64 inflates image bytes ~33% over the wire; images are sent to the backend even though (today) they are not forwarded to the model. Once vision is enabled, consider downscaling images client-side before upload. | Low | Future |
| P3 | No response caching for identical page inputs. Not needed for MVP. | Low | Future |
| P4 | Sync FastAPI endpoint runs the blocking OpenAI call in a threadpool. Fine at MVP scale; note `async` + async OpenAI client for higher concurrency. | Low | Future |

### 2.5 Code Quality / Refactoring

| # | Finding | Severity | Scope |
|---|---------|----------|-------|
| R1 | **Dead code:** `shared/components/layout-card` (still `<p>layout-card works!</p>`) and `shared/components/image-upload` (empty class) are not used anywhere. Remove them. | Low | MVP (cleanup) |
| R2 | **Stale auto-generated `.spec.ts`** files test default scaffolding and are not meaningful; some may fail now that components inject `Router`/state. Replace with real tests or remove. | Medium | MVP |
| R3 | OpenAI client + API-key check run at module import. Prefer a small startup/init function (testability + clean failure — see E1). | Low | NTH |
| R4 | Prompt image guidance is duplicated between system and user prompt. Minor; keep the single source in the system prompt. | Low | NTH |

---

## 3. Prompt Validation

**Strengths:** the system prompt has Role, Goal, Constraints, an output schema,
and per-type guidance; output is forced to JSON (`response_format=json_object`)
and validated by Pydantic (`GenerateLayoutResponse`). Two distinct
`layout_type`s are now enforced. This is production-shaped prompt design ✅.

**Gaps / improvements:**
- The in-prompt example shows `layout_2` with an **empty** `sections` array — a
  weak example. Provide a complete two-option example (few-shot) to improve
  determinism. (NTH)
- No server-side clamp of `image_reference` to the real image count (see F2).
- Because of F1, the "analyze the images" instruction is aspirational — the model
  cannot see them. Either enable vision (send `image_url` blocks) or reword the
  prompt to be honest ("you are told how many images exist") and document it.

**Validation net (good):** invalid/malformed model output → `model_validate`
raises → mapped to a clean error. That is the right safety pattern.

---

## 4. Edge Cases to Cover (test matrix)

| Case | Expected behaviour |
|------|--------------------|
| Empty page text | Blocked client-side (alert) + server 422 (`min_length=1`) ✅ |
| Text, zero images | Layout generated with no image sections ✅ (prompt handles) |
| `image_reference` out of range | Should render nothing for that slot, not a broken image (needs F2 fix) |
| Model returns two identical `layout_type` | Prompt forbids it; renderer still degrades gracefully (Hero fallback) ✅ |
| Model returns invalid JSON / wrong shape | Pydantic validation → clean error ✅ |
| OpenAI 401 / 429 / quota / timeout | Mapped to typed exceptions ✅ (verify each in tests) |
| Very large image upload | Currently unbounded (needs S1 fix) |
| Navigate to `/layout-preview` or `/book-summary` directly (no state) | Guarded → redirect ✅ |
| Add page → cancel | No cancel path today (out of scope, documented) |

---

## 5. Test Plan (to implement next, on approval)

**Frontend unit (Jasmine):**
1. `section-grouping.spec.ts` — grouping by role, ordering, empty/null input.
2. `image-ref.pipe.spec.ts` — valid index, out-of-range, null image list.
3. `book-state.service.spec.ts` — startNewBook, startDraft, commitCurrentPage
   (page number increment, draft cleared), resetBook.

**Backend unit/integration (pytest):**
4. `test_request_schema.py` — required `page_text`, optional images, `min_length`.
5. `test_response_schema.py` — valid response parses; malformed raises.
6. `test_prompt.py` — `build_user_prompt` includes title/objective/text and the
   image-count constraint.
7. `test_layout_endpoint.py` — `/api/layout/generate` with the **OpenAI client
   mocked**: happy path returns validated JSON; simulated `AuthenticationError`,
   `RateLimitError`, malformed output → correct status codes.

**Runnable here:** the pytest suite (I can execute it in a clean venv to prove
green). The Jasmine suite runs via `ng test` on your Windows machine.

---

## 6. Production Readiness Checklist

Legend: ✅ done · ⚠️ partial / recommended · ❌ missing · ⛔ out of MVP scope

**Functionality**
- ✅ Page-by-page text+image input, 2 AI options, selection, complete draft
- ⚠️ Vision (image content) — **not wired** (F1): decide enable vs document
- ⚠️ `image_reference` bounds safety (F2)

**Reliability / Error Handling**
- ✅ Typed OpenAI error mapping (401/402/429/400/500)
- ❌ Backend logging (E3)
- ⚠️ Startup failure on missing key is ungraceful (E1)
- ✅ Frontend retry-once + error path

**Security**
- ✅ XSS-safe rendering (interpolation, no innerHTML)
- ✅ API key via env / not committed
- ❌ Image size/count limits (S1)
- ⚠️ Prompt-injection documented but not mitigated (S2)
- ⚠️ CORS/methods tightening for prod (S4)

**Performance / Scale**
- ✅ Page-at-a-time keeps within LLM context (PRD §8)
- ⚠️ No `max_tokens` / timeout (F3)
- ⛔ Batching, caching, async client (Future)

**Testing**
- ❌ Meaningful unit/integration tests (Section 5)
- ⚠️ Stale scaffolding specs (R2)

**Code Quality**
- ⚠️ Remove dead components (R1)
- ✅ Modular structure, strong typing, strict Angular templates

**Config / Ops**
- ✅ `.env.example` present
- ⛔ Dockerfile / CI / deploy (Future)

---

## 7. Likely CTO Interview Questions (and strong answers)

1. **"You list vision support — show me where an image reaches the model."**
   Honest answer: today the backend passes only the image *count*; image content
   is not sent. Either we enable it (GPT-4o `image_url` base64 blocks) or we
   state it as a scoped assumption. Knowing the gap is the point.
2. **"How do you stop the LLM from breaking your UI?"** The model never emits
   HTML/CSS — only typed JSON, validated by Pydantic, rendered by Angular via
   escaped interpolation. No markup-injection/XSS surface; invalid output fails
   validation, not the UI.
3. **"How does this scale to 500 pages?"** Page-at-a-time processing bounds each
   request within context limits; state is per-session. Scale path: async client,
   caching, and persistence (Future).
4. **"What's non-deterministic, and how do you test it?"** Layout quality is the
   LLM's job (not unit-testable); we test the deterministic seams — schema,
   prompt building, JSON→render mapping, state transitions — and mock the LLM.
5. **"Biggest risk in production?"** Cost/latency and prompt injection. Mitigations:
   `max_tokens` + timeout + size caps; schema validation bounds injection impact.
6. **"What would you do with one more week?"** Enable vision, add real tests +
   CI, snackbar UX, image size limits, and persistence.

---

## 8. Recommended Order of Execution (Phase 8)

1. **Quick correctness/safety fixes (MVP):** F2 (`image_reference` clamp), F3
   (`max_tokens` + timeout), E1/E3 (graceful startup + minimal logging), R1
   (remove dead code), S1 (image size cap).
2. **Tests:** implement Section 5, run pytest to green.
3. **Decision:** F1 vision — enable or document as an assumption.
4. **Docs:** fold assumptions/trade-offs into README/Architecture (Phase 9).
