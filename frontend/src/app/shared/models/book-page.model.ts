import { LayoutOption } from './layout-option.model';
import { PageImage } from './page-image.model';

/**
 * A single, FINISHED page of the book.
 *
 * A page is only "finished" once the user has picked one of the two AI layout
 * options. We store the chosen layout in full (`selectedLayout`) plus the raw
 * inputs (text + images) so the book preview can re-render the page at any time
 * without another AI call — rendering stays a pure function of stored data.
 */
export interface BookPage {
  /** 1-based position of this page in the book. */
  pageNumber: number;

  /** Original page text the user typed. */
  pageText: string;

  /** AI-generated one-line summary of the page. */
  pageSummary: string;

  /** Images uploaded for THIS page (indexed by image_reference). */
  images: PageImage[];

  /** The layout option the user selected for this page. */
  selectedLayout: LayoutOption;
}
