# Recording Script (Narration)

A tight ~4–5 minute walkthrough, mapped slide-by-slide to the deck
(`docs/submission/AI-Visual-Book-Generator-Deck.pptx`). **Bold** = what to show;
quoted text is what to say (close to verbatim). The same lines are in each
slide's speaker notes, so you can present from the deck directly.

**Before recording:** backend running (`uvicorn app.main:app --reload --port 8000`),
frontend running (`npm start`), a short paragraph of page text ready, and 2–3
images to upload. Present slides 1–6 from the deck, switch to the browser for
slide 7 (demo), then return to slides 8–10.

---

### Slide 1 · Introduction  (~20–30s)

> "Hello, my name is Aman Agrawal. I have around 11-plus years of software
> engineering experience and an M.Tech in Artificial Intelligence and Machine
> Learning from IIT Jodhpur. Today I'll walk through my solution for the EY GenAI
> Engineering Assignment — the AI-Powered Visual Book Generator."

### Slide 2 · Problem Statement  (~30s)

> "Marketing and content teams create content-heavy documents that take a lot of
> manual effort to turn into well-designed layouts. Designers arrange text and
> images and iterate many times before the result looks polished. The objective
> here is to automate that first draft using a Large Language Model — cutting the
> manual effort while keeping the layout recommendations context-aware."

### Slide 3 · Project Objectives  (~20–30s)

> "The objectives come straight from the PRD. It's a browser-based app that
> accepts optional book context, page text, and images. For each page the AI
> produces two layout options, the user picks one, and we keep going page by page
> until we have a complete book draft."

### Slide 4 · Architecture  (~40s)

> "Here's the high-level design. Angular calls FastAPI over HTTP; FastAPI builds
> the prompt and calls OpenAI; OpenAI returns structured JSON; and Angular renders
> it through one of several layout strategies.
> The most important decision: the LLM never generates HTML or CSS. It only
> decides the layout as JSON — Angular owns all presentation. That gives me
> security, because there's no model-generated markup to inject; it's deterministic
> and testable; and restyling never costs another AI call."

### Slide 5 · Technology Stack  (~30s)

> "On the stack: Angular for a modern, typed, component-based SPA with Signals for
> clean state. FastAPI because it's high-performance and async, with Pydantic
> giving me first-class validation for a typed AI contract. And OpenAI for its
> reasoning and structured JSON output — it's also vision-capable, which is on my
> roadmap."

### Slide 6 · AI Workflow  (~30s)

> "The AI workflow is six stages: user input, backend validation, prompt
> construction, GPT layout reasoning, structured JSON, and Angular rendering. The
> key idea is separation of concerns — the AI only reasons about layout, and
> Angular is solely responsible for presentation. That makes the whole thing safe,
> predictable and easy to test."

### Slide 7 · Live Demo  (~90–120s)  — *switch to the browser*

**Home → Start New Book.**
> "Let me show it working. I'll start a new book."

**New-book — type title + objective.**
> "Title and objective are optional context for the model — I'll add 'AI
> Fundamentals'."

**Page-input — paste text, upload 2–3 images.**
> "Now the page content: some text, and I'll upload a few images."

**Click Generate → generating screen.**
> "This calls FastAPI, which prompts OpenAI and gets back structured JSON."

**Layout-preview — the two options.**
> "Here are the two options — notice they're structurally different: a Hero layout
> and a Magazine spread. That difference is the AI's decision; Angular just
> rendered the JSON. I'll pick the Hero layout."

**Continue → Add Next Page → quickly do page 2 → Finish Book.**
> "I select it, the page is committed, and I can add another page. Then I finish
> the book."

**Book-summary with navigation.**
> "This is the complete draft — I can navigate the pages, each rendered with the
> layout I chose, and it re-renders from stored data with no extra AI calls."

### Slide 8 · Engineering Decisions  (~30s)

> "A few decisions I can defend: page-level processing keeps each request within
> the model's context limits; JSON output makes the result safe and deterministic;
> FastAPI gives async performance and validation; Angular gives a typed reactive
> UI. And I deliberately left out a database and drag-and-drop — both are explicit
> non-goals for this MVP."

### Slide 9 · Future Enhancements  (~20s)

> "Next steps would be enabling true image vision, natural-language layout editing,
> persistent storage, PDF export, cross-page style consistency, and batch
> processing — several of these come directly from the PRD's future enhancements."

### Slide 10 · Thank You  (~10s)

> "That's the AI-Powered Visual Book Generator — a working prototype that produces
> context-aware layouts far faster than manual typesetting, with a clear path to
> production. Thank you for your time; I'm happy to discuss any architectural
> decision or implementation detail."

---

### Tips
- Keep it under ~5 minutes; let the live demo breathe.
- If a generation is slow on camera, keep narrating the architecture over it.
- These are guide rails — say it in your own voice, don't read robotically.
