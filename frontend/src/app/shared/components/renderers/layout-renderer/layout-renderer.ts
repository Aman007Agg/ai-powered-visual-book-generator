import { Component, computed, input } from '@angular/core';

import { LayoutOption } from '../../../models/layout-option.model';
import { PageImage } from '../../../models/page-image.model';

import { HeroLayout } from '../hero-layout/hero-layout';
import { SplitLayout } from '../split-layout/split-layout';
import { MagazineLayout } from '../magazine-layout/magazine-layout';

/**
 * LayoutRenderer — the rendering "dispatcher".
 *
 * Responsibility: given ONE AI-generated layout option, decide which visual
 * strategy component (Hero / Split / Magazine) should draw it, based purely on
 * the AI's `layout_type`. This is the Strategy pattern: the algorithm
 * (visual arrangement) is selected at runtime from data, not hardcoded.
 *
 * Why rendering is separated from AI generation:
 *  - Separation of concerns: the model decides SEMANTICS (which archetype,
 *    section order, which image goes where); Angular owns PRESENTATION
 *    (pixels, responsive CSS, accessibility).
 *  - Security: the model never emits HTML/CSS, so there is no markup-injection
 *    (XSS) surface. We only ever bind a validated, typed JSON contract.
 *  - Determinism & testability: rendering is a pure function of JSON -> DOM,
 *    with no LLM nondeterminism in the UI layer.
 *  - Cost & speed: restyling (brand, spacing, fonts) never requires another
 *    model call.
 *  - Portability: the same JSON can later target PDF/print without touching AI.
 *
 * `layout_type` is normalised and unknown values fall back to Hero, so a novel
 * or malformed type from the model degrades gracefully instead of breaking.
 */
@Component({
  selector: 'app-layout-renderer',
  standalone: true,
  imports: [HeroLayout, SplitLayout, MagazineLayout],
  templateUrl: './layout-renderer.html',
  styleUrl: './layout-renderer.scss',
})
export class LayoutRenderer {

  readonly layout = input.required<LayoutOption>();

  readonly images = input<PageImage[]>([]);

  /** Case-insensitive, trimmed layout type used for strategy selection. */
  readonly layoutType = computed(() =>
    (this.layout().layout_type ?? '').toLowerCase().trim(),
  );
}
