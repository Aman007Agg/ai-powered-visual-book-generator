import { Component, computed, input } from '@angular/core';

import { LayoutOption } from '../../../models/layout-option.model';
import { PageImage } from '../../../models/page-image.model';
import { ImageRefPipe } from '../../../pipes/image-ref.pipe';
import { groupSections } from '../../../utils/section-grouping';

/**
 * HERO strategy.
 *
 * Visual identity: one large "hero" image dominates the top of the page, the
 * title sits directly beneath it, body text follows, and any remaining images
 * become a small supporting thumbnail row. Emphasis is on a single strong
 * opening visual.
 *
 * Presentational (dumb) component: it owns NO state and makes NO service
 * calls. It receives AI-decided data via signal inputs and renders pixels.
 */
@Component({
  selector: 'app-hero-layout',
  standalone: true,
  imports: [ImageRefPipe],
  templateUrl: './hero-layout.html',
  styleUrl: './hero-layout.scss',
})
export class HeroLayout {

  /** The AI-generated layout option to render. */
  readonly layout = input.required<LayoutOption>();

  /** Uploaded images, indexed by AI `image_reference`. */
  readonly images = input<PageImage[]>([]);

  /** Sections regrouped by role (title / paragraphs / images). */
  readonly grouped = computed(() => groupSections(this.layout().sections));

  /** First image is the hero; the rest are supporting thumbnails. */
  readonly heroRef = computed<number | null>(() => {
    const refs = this.grouped().imageRefs;
    return refs.length ? refs[0] : null;
  });

  readonly supportingRefs = computed<number[]>(() =>
    this.grouped().imageRefs.slice(1),
  );
}
