import { Injectable, computed, signal } from '@angular/core';

import { Book } from '../../../shared/models/book.model';
import { BookPage } from '../../../shared/models/book-page.model';
import { PageImage } from '../../../shared/models/page-image.model';
import { GenerateLayoutResponse } from '../../../shared/models/generate-layout-response.model';

/**
 * BookStateService — single source of truth for the multi-page workflow.
 *
 * Two kinds of state live here:
 *  1. The BOOK: title, objective, and the list of FINISHED pages.
 *  2. The DRAFT: the page currently being built (its text, images, and the
 *     two AI layout options) before the user commits a layout choice.
 *
 * Why a signal store (not RxJS Subjects)?
 *  - Signals are synchronous, glitch-free, and integrate with zoneless change
 *    detection: any component reading a signal re-renders automatically when it
 *    changes, with no manual subscribe/unsubscribe and no memory leaks.
 *  - Reads are simple function calls (`pages()`), which keeps templates clean.
 *  - Internal writable signals are kept private and only exposed read-only, so
 *    state can only change through intention-revealing methods (encapsulation).
 *
 * Why hold state in a service at all (vs. router params / inputs)?
 *  - The workflow spans several lazily-loaded route components; a root-provided
 *    service is the simplest shared, in-memory store that survives navigation.
 *  - MVP scope: no persistence/DB. A production version would add
 *    autosave to a backend and hydrate on reload (see Architecture notes).
 */
@Injectable({
  providedIn: 'root',
})
export class BookStateService {

  // --- Book-level state (writable, private) ---
  private readonly _title = signal('');
  private readonly _objective = signal('');
  private readonly _pages = signal<BookPage[]>([]);

  // --- Draft (in-progress page) state (writable, private) ---
  private readonly _draftText = signal('');
  private readonly _draftImages = signal<PageImage[]>([]);
  private readonly _draftResponse =
    signal<GenerateLayoutResponse | undefined>(undefined);

  // --- Public read-only views ---
  readonly title = this._title.asReadonly();
  readonly objective = this._objective.asReadonly();
  readonly pages = this._pages.asReadonly();
  readonly pageCount = computed(() => this._pages().length);

  readonly draftImages = this._draftImages.asReadonly();
  readonly draftResponse = this._draftResponse.asReadonly();

  /** Convenience projection of the whole book. */
  readonly book = computed<Book>(() => ({
    title: this._title(),
    objective: this._objective(),
    pages: this._pages(),
  }));

  /**
   * Begin a brand new book. Clears any previous pages and draft.
   */
  startNewBook(title: string, objective: string): void {
    this._title.set(title.trim());
    this._objective.set(objective.trim());
    this._pages.set([]);
    this.clearDraft();
  }

  /**
   * Record the raw inputs for the page currently being generated.
   */
  startDraft(pageText: string, images: PageImage[]): void {
    this._draftText.set(pageText);
    this._draftImages.set(images);
    this._draftResponse.set(undefined);
  }

  /**
   * Store the AI's two layout options for the current draft page.
   */
  setDraftResponse(response: GenerateLayoutResponse): void {
    this._draftResponse.set(response);
  }

  /**
   * Commit the current draft as a finished page using the chosen layout,
   * then clear the draft so the next page starts fresh.
   * No-ops safely if there is no draft or the id is unknown.
   */
  commitCurrentPage(selectedLayoutId: string): void {
    const response = this._draftResponse();
    if (!response) {
      return;
    }

    const selectedLayout = response.layout_options.find(
      option => option.id === selectedLayoutId,
    );
    if (!selectedLayout) {
      return;
    }

    const page: BookPage = {
      pageNumber: this._pages().length + 1,
      pageText: this._draftText(),
      pageSummary: response.page_summary,
      images: this._draftImages(),
      selectedLayout,
    };

    this._pages.update(pages => [...pages, page]);
    this.clearDraft();
  }

  /**
   * Clear the in-progress draft (text, images, AI response).
   */
  clearDraft(): void {
    this._draftText.set('');
    this._draftImages.set([]);
    this._draftResponse.set(undefined);
  }

  /**
   * Reset everything back to an empty book.
   */
  resetBook(): void {
    this._title.set('');
    this._objective.set('');
    this._pages.set([]);
    this.clearDraft();
  }
}
