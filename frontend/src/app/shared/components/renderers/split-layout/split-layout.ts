import { Component, computed, input } from '@angular/core';

import { LayoutOption } from '../../../models/layout-option.model';
import { PageImage } from '../../../models/page-image.model';
import { ImageRefPipe } from '../../../pipes/image-ref.pipe';
import { groupSections } from '../../../utils/section-grouping';

/**
 * SPLIT strategy.
 *
 * Visual identity: a two-column layout. Images are stacked in the left column,
 * the title and body text occupy the right column. Balanced, editorial feel.
 * Collapses to a single column on narrow screens (responsive by CSS Grid).
 *
 * Presentational (dumb) component: state-free, service-free.
 */
@Component({
  selector: 'app-split-layout',
  standalone: true,
  imports: [ImageRefPipe],
  templateUrl: './split-layout.html',
  styleUrl: './split-layout.scss',
})
export class SplitLayout {

  readonly layout = input.required<LayoutOption>();

  readonly images = input<PageImage[]>([]);

  readonly grouped = computed(() => groupSections(this.layout().sections));
}
