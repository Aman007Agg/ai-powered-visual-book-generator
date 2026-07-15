import { Component, OnInit, computed, inject, signal } from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { Router } from '@angular/router';

import { BookStateService } from '../../../../core/services/state/book-state.service';
import { LayoutRenderer } from '../../../../shared/components/renderers/layout-renderer/layout-renderer';

/**
 * BookSummary — the COMPLETE book draft preview.
 *
 * Renders each finished page with the layout the user selected, reusing the
 * same LayoutRenderer as the preview screen. This is the payoff of separating
 * rendering from AI generation: the stored JSON per page redraws with zero
 * extra model calls. Includes page navigation and the loop-back actions.
 *
 * Uses inject() (not constructor params) so the service is available while the
 * signal-derived fields below are initialised.
 */
@Component({
  selector: 'app-book-summary',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    LayoutRenderer
  ],
  templateUrl: './book-summary.html',
  styleUrl: './book-summary.scss'
})
export class BookSummary implements OnInit {

  private readonly bookState = inject(BookStateService);
  private readonly router = inject(Router);

  readonly title = this.bookState.title;
  readonly pages = this.bookState.pages;
  readonly pageCount = this.bookState.pageCount;

  /** Index of the page currently shown in the preview. */
  readonly currentIndex = signal(0);

  readonly currentPage = computed(() => this.pages()[this.currentIndex()]);

  ngOnInit(): void {
    // Nothing to show if no pages were committed — return to the start.
    if (this.pageCount() === 0) {
      this.router.navigate(['/new-book']);
    }
  }

  previousPage(): void {
    this.currentIndex.update(index => Math.max(0, index - 1));
  }

  nextPage(): void {
    this.currentIndex.update(
      index => Math.min(this.pageCount() - 1, index + 1)
    );
  }

  addAnotherPage(): void {
    this.router.navigate(['/page-input']);
  }

  startNewBook(): void {
    this.bookState.resetBook();
    this.router.navigate(['/new-book']);
  }

}
