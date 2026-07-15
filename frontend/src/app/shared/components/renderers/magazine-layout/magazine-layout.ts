import { Component, computed, input } from '@angular/core';

import { LayoutOption } from '../../../models/layout-option.model';
import { PageImage } from '../../../models/page-image.model';
import { ImageRefPipe } from '../../../pipes/image-ref.pipe';
import { groupSections } from '../../../utils/section-grouping';

/**
 * MAGAZINE strategy.
 *
 * Visual identity: a full-width headline spans the top, images sit in a
 * responsive multi-panel grid beneath it, and the body text flows in
 * newspaper-style columns. Dense, information-rich, "editorial spread" feel.
 *
 * Presentational (dumb) component: state-free, service-free.
 */
@Component({
  selector: 'app-magazine-layout',
  standalone: true,
  imports: [ImageRefPipe],
  templateUrl: './magazine-layout.html',
  styleUrl: './magazine-layout.scss',
})
export class MagazineLayout {

  readonly layout = input.required<LayoutOption>();

  readonly images = input<PageImage[]>([]);

  readonly grouped = computed(() => groupSections(this.layout().sections));
}
