import { Injectable } from '@angular/core';

import { GenerateLayoutResponse } from '../../../shared/models/generate-layout-response.model';
import { PageImage } from '../../../shared/models/page-image.model';

@Injectable({
  providedIn: 'root'
})
export class LayoutStateService {

  private layoutResponse?: GenerateLayoutResponse;
  private pageImages: PageImage[] = [];

  /**
   * Stores the latest AI generated layouts.
   */
  setLayoutResponse(
    response: GenerateLayoutResponse
  ): void {

    this.layoutResponse = response;

  }

  /**
   * Returns the stored AI response.
   */
  getLayoutResponse():
    GenerateLayoutResponse | undefined {

    return this.layoutResponse;

  }

  /**
 * Stores uploaded page images.
 */
  setPageImages(images: PageImage[]): void {
    this.pageImages = images;
  }

  /**
 * Returns uploaded page images.
 */
  getPageImages(): PageImage[] {
    return this.pageImages;
  }

  /**
   * Clears the stored response.
   */
  clear(): void {

    this.layoutResponse = undefined;
    this.pageImages = [];
  }

}