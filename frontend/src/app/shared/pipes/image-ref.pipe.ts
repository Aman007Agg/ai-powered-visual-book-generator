import { Pipe, PipeTransform } from '@angular/core';

import { PageImage } from '../models/page-image.model';

/**
 * Resolves an AI `image_reference` index into a renderable base64 `src`.
 *
 * Why a pure pipe?
 * - Rendering must stay presentational and deterministic. The AI never sends
 *   image bytes, only an index (`image_reference`). This pipe is the single,
 *   reusable place that maps that index onto the uploaded images.
 * - Being `pure` (default), Angular memoizes the result and only recomputes
 *   when the reference or the images array reference changes. Cheap and safe.
 * - Keeps the three layout components free of duplicated lookup logic (DRY).
 */
@Pipe({
  name: 'imageRef',
  standalone: true,
})
export class ImageRefPipe implements PipeTransform {

  transform(
    reference: number | null | undefined,
    images: PageImage[] | null | undefined,
  ): string {

    if (reference == null || !images) {
      return '';
    }

    return images[reference]?.base64 ?? '';
  }
}
