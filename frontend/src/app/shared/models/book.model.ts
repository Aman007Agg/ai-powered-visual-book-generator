import { BookPage } from './book-page.model';

/**
 * The complete book draft being assembled page by page.
 */
export interface Book {
  /** Optional book title (context for the AI, shown in the preview). */
  title: string;

  /** Optional book objective (context for the AI). */
  objective: string;

  /** All finished pages, in reading order. */
  pages: BookPage[];
}
