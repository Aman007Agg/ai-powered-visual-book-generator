import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';

import { Router } from '@angular/router';
import { BookStateService } from '../../../../core/services/state/book-state.service';
import { LayoutOption } from '../../../../shared/models/layout-option.model';
import { PageImage } from '../../../../shared/models/page-image.model';
import { LayoutRenderer } from '../../../../shared/components/renderers/layout-renderer/layout-renderer';

@Component({
  selector: 'app-layout-preview',
  standalone: true,
  imports: [
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatRadioModule,
    MatIconModule,
    LayoutRenderer
  ],
  templateUrl: './layout-preview.html',
  styleUrl: './layout-preview.scss'
})
export class LayoutPreview implements OnInit {

  layoutOptions: LayoutOption[] = [];
  selectedLayoutId = '';

  /** Images for the current draft page (passed to the renderer). */
  images: PageImage[] = [];

  /** 1-based number of the page being chosen. */
  pageNumber = 1;

  /** Becomes true once the layout is committed, revealing the next actions. */
  readonly committed = signal(false);

  constructor(
    private readonly bookState: BookStateService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    const response = this.bookState.draftResponse();

    if (!response) {
      this.router.navigate(['/page-input']);
      return;
    }

    this.layoutOptions = response.layout_options;
    this.images = this.bookState.draftImages();
    this.pageNumber = this.bookState.pageCount() + 1;

    if (this.layoutOptions.length > 0) {
      this.selectedLayoutId = this.layoutOptions[0].id;
    }
  }

  /**
   * Commit the chosen layout as a finished page, then let the user decide
   * whether to add another page or finish the book (the PRD loop).
   */
  continueWithSelectedLayout(): void {

    const selectedLayout = this.layoutOptions.find(
      layout => layout.id === this.selectedLayoutId
    );

    if (!selectedLayout) {
      alert('Please select a layout.');
      return;
    }

    this.bookState.commitCurrentPage(this.selectedLayoutId);
    this.committed.set(true);
  }

  addNextPage(): void {
    this.router.navigate(['/page-input']);
  }

  finishBook(): void {
    this.router.navigate(['/book-summary']);
  }

}
