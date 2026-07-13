import { PageImage } from './page-image.model';

export interface GenerateLayoutRequest {
  /**
   * Optional book title.
   */
  title?: string;

  /**
   * Optional book objective.
   */
  objective?: string;

  /**
   * Text content for the current page.
   */
  page_text: string;

  /**
   * Images uploaded for the current page.
   */
  images: PageImage[];
}