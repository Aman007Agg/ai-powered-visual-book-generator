# Assumptions & Trade-offs (MVP)

This records deliberate scoping decisions so they can be defended in review.
Each item follows the PRD's guidance (§8: "Functionality first, quality later")
and the MVP Non-Goals (§6).

## A1 — Image analysis uses metadata, not vision (scoped)

**Decision:** For the MVP, the AI selects a layout using the page **text** and
the **number** of uploaded images, not the pixel content of the images. The
backend receives images (base64) but does not currently send them to the model
as `image_url` vision inputs.

**Why this is acceptable for the MVP:**
- The PRD's core deliverable is *layout/typesetting* selection. Layout archetype
  (hero vs split vs magazine) is driven mostly by the amount of text and the
  count/placement of images — information we already have.
- It keeps token cost and latency low and the flow deterministic and cheap to
  demo, consistent with PRD §8 ("functionality first").
- The rendering contract is unchanged, so enabling vision later is additive.

**Trade-off / limitation:** the model cannot reason about what an image *depicts*
(e.g. "this is a wide chart, give it a full-width band"). This slightly weakens
PRD §9's "context-aware layout decisions" for the image dimension.

**Upgrade path (Future / one-line change in the service):** send GPT-4o
`image_url` content blocks (data URIs) alongside the text so the model sees the
images. Gated behind an image size cap to control cost.

## A2 — In-memory state, no persistence

Per PRD §6 ("no persistent storage required"), the book lives in memory for the
session; a refresh starts over. Production would add autosave + hydrate.

## A3 — Text is required per page; images are optional

The PRD lists text and images as page input but does not mandate both. We treat
**text as the minimum** and images as optional enrichment. Image-only pages are
out of scope.

## A4 — Client-side prototype, single user

No auth, no collaboration, dev-only CORS (`localhost:4200`). Matches PRD §6 and
the "client-side preferred" deliverable note (§10).

## A5 — One page per model request

Pages are processed individually to stay within LLM context limits (PRD §8,
~500 pages). Batching/summarization is a documented Future enhancement.
