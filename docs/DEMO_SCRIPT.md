# Demo Script & Presentation Flow

A concise, CTO-friendly walkthrough. Target length: **3–4 minutes**. Speak to
decisions and trade-offs, not just clicks.

---

## 0. Before you record

- Backend running: `uvicorn app.main:app --reload --port 8000` (valid `OPENAI_API_KEY`).
- Frontend running: `npm start` → `http://localhost:4200`.
- Have 2–3 images ready and a short paragraph of page text.
- Close noisy tabs; zoom the browser so text is legible on video.

---

## 1. Opening (~30s)

> "Marketing and content teams turn large documents into designed pages by hand —
> slow and iterative. This tool automates the **first draft of layout/typesetting**
> with an LLM. For each page it proposes **two intelligent layout options**, the
> user picks one, and we assemble a complete book draft page by page.
> The key idea: **the AI decides layout; the app renders it** — the model never
> writes HTML."

---

## 2. Live walkthrough (~2 min)

1. **Create New Book** — type a title + objective. *"Both optional — they're
   context for the model, per the PRD."*
2. **Page Content** — paste text, upload 2–3 images. *"Text is the minimum;
   images are optional enrichment."*
3. **Generate → Choose Layout** — two options appear.
   - Call out: *"These are **structurally different** — Hero vs Magazine — driven
     by the AI's `layout_type`, not a static template. The model returned
     **JSON**; Angular rendered it."*
   - Point at confidence + descriptions.
4. **Select a layout → Continue** — *"Page committed to book state."*
5. **Add Next Page** — do a second page; show the two options differ again.
6. **Finish Book → Complete Book Draft** — navigate pages with Previous/Next.
   *"Each page re-renders from stored JSON — no extra AI calls."*

---

## 3. Architecture in one breath (~45s)

Show the diagram from [ARCHITECTURE.md](ARCHITECTURE.md):

> "Three layers with clean separation: **Angular** owns UI, state and rendering;
> **FastAPI** owns validation, prompt orchestration and error mapping; **OpenAI**
> only does layout reasoning and returns **structured JSON**. That JSON is
> validated by Pydantic and mapped to a **Strategy-based renderer** —
> Hero / Split / Magazine — with a safe fallback."

---

## 4. Engineering highlights (~30s)

- **Structured JSON contract + Pydantic validation** — robust against bad output.
- **Strategy renderer** — open/closed; adding a layout is a new component, not edits.
- **Angular Signals + zoneless** change detection; **RxJS** only at the HTTP seam.
- **Security** — the model never emits markup; Angular escapes text ⇒ no XSS.
- **Tests** — pytest (schemas, prompt, endpoint with OpenAI mocked) + Vitest
  (state, pipe, grouping).

---

## 5. Honest scoping (~15s) — *this scores points*

> "Two deliberate MVP scopes, both documented: image **vision** isn't wired yet —
> the model gets the image count, not pixels — and a set of production-hardening
> items (timeouts, size caps, logging) are deferred per the PRD's
> 'functionality-first' guidance. Both are in `ASSUMPTIONS.md` with upgrade paths."

---

## 6. Close (~10s)

> "So: a working, client-side-first prototype that produces context-aware layouts
> significantly faster than manual typesetting — meeting the PRD's success criteria,
> with a clear path to production."

---

## Suggested slide order (if presenting)

1. Problem & goal (PRD §1–2)
2. Live demo (the walkthrough above)
3. Architecture diagram + separation of concerns
4. The AI contract: prompt → JSON → validation → render
5. Rendering strategy (Hero/Split/Magazine)
6. State, testing, security highlights
7. Assumptions, trade-offs & roadmap
8. Q&A (see CTO questions in ARCHITECTURE.md §10)

---

## Screenshots to include

Place images in `docs/screenshots/` and reference them in the README/slides:

| File | Screen |
|------|--------|
| `01-new-book.png` | Create New Book (title + objective) |
| `02-page-input.png` | Page Content + image upload |
| `03-layout-options.png` | Two distinct layout options (Hero vs Magazine) |
| `04-book-summary.png` | Complete Book Draft with page navigation |

(You already have these from testing — drop them in that folder.)

---

## GitHub repository preparation checklist

- [ ] **Secrets**: confirm `backend/.env` is git-ignored and **not** committed
      (only `.env.example` is tracked). Rotate the key if it was ever pushed.
- [ ] `README.md` complete and accurate (done).
- [ ] `docs/` present: ARCHITECTURE, API, PROMPTS, ASSUMPTIONS, DEMO, Phase 8 review.
- [ ] Add a real `LICENSE` (file currently empty) — e.g. MIT — or state "internal".
- [ ] Remove stray empty scaffolding files if desired (`docs/.gitkeep`,
      `backend/.gitkeep`) now that real files exist.
- [ ] `npm install && npm run build` and `pytest` pass on a clean clone.
- [ ] Clear, conventional commit history; a short tag/release for submission.
- [ ] Repo description + topics set on GitHub.
