import { Component, ViewChild, ElementRef, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';

import { PageImage } from '../../../../shared/models/page-image.model';

import { Router } from '@angular/router';

import { ApiService } from '../../../../core/services/http/api-service';
import { BookStateService } from '../../../../core/services/state/book-state.service';

import { GenerateLayoutRequest } from '../../../../shared/models/generate-layout-request.model';
import { GenerateLayoutResponse } from '../../../../shared/models/generate-layout-response.model';

@Component({
  selector: 'app-page-input',
  standalone: true,
  imports: [
    FormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule
  ],
  templateUrl: './page-input.html',
  styleUrl: './page-input.scss'
})
export class PageInput {

  // Page Content (bound via ngModel; input events trigger change detection).
  pageContent = '';

  /**
   * Uploaded images + previews are SIGNALS.
   *
   * The app is zoneless, so mutating a plain class field inside the async
   * FileReader callback would NOT trigger change detection — the previews only
   * appeared on the *next* user click (the reported bug). Writing to a signal
   * notifies Angular's scheduler, so the view updates on the first selection.
   */
  readonly selectedImages = signal<PageImage[]>([]);
  readonly imagePreviews = signal<string[]>([]);

  // UI State (signal so the async success/error callback re-renders the button).
  readonly isGenerating = signal(false);

  @ViewChild('imageInput')
  imageInput!: ElementRef<HTMLInputElement>;

  constructor(
    private readonly apiService: ApiService,
    private readonly bookState: BookStateService,
    private readonly router: Router
  ) {}

  openFileSelector(): void {
    this.imageInput.nativeElement.click();
  }

  async onFilesSelected(event: Event): Promise<void> {

    const input = event.target as HTMLInputElement;

    if (!input.files?.length) {
      return;
    }

    const images: PageImage[] = [];
    const previews: string[] = [];

    for (const file of Array.from(input.files)) {

      const base64 = await this.convertToBase64(file);

      images.push({
        fileName: file.name,
        mimeType: file.type,
        base64
      });

      previews.push(base64);
    }

    // Single signal write per collection -> one clean re-render.
    this.selectedImages.set(images);
    this.imagePreviews.set(previews);

    // Reset the input so selecting the SAME file(s) again still fires 'change'.
    input.value = '';
  }

  private convertToBase64(file: File): Promise<string> {

    return new Promise((resolve, reject) => {

      const reader = new FileReader();

      reader.onload = () => {
        resolve(reader.result as string);
      };

      reader.onerror = reject;

      reader.readAsDataURL(file);

    });

  }

  generateLayouts(): void {

    if (!this.pageContent.trim()) {
      alert('Please enter page content.');
      return;
    }

    this.isGenerating.set(true);

    const request: GenerateLayoutRequest = {
      // Book-level context persists in state across pages.
      title: this.bookState.title(),
      objective: this.bookState.objective(),
      page_text: this.pageContent,
      images: this.selectedImages()
    };

    // Record the raw inputs for this draft page before calling the AI.
    this.bookState.startDraft(this.pageContent, this.selectedImages());

    this.apiService
      .generateLayouts(request)
      .subscribe({

        next: (response: GenerateLayoutResponse) => {
          this.bookState.setDraftResponse(response);
          this.router.navigate(['/generating']);
        },

        error: (error) => {
          console.error(error);
          this.isGenerating.set(false);
          alert('Layout generation failed.');
        }

      });

  }

}
