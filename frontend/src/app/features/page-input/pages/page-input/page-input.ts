import { Component, ViewChild,  ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';

import { PageImage } from '../../../../shared/models/page-image.model';

import { Router } from '@angular/router';

import { ApiService } from '../../../../core/services/http/api-service';

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

  // Page Content
  pageContent = '';

  // Uploaded Images
  selectedImages: PageImage[] = [];
  imagePreviews: string[] = [];

  // UI State
  isGenerating = false;

  @ViewChild('imageInput')
  imageInput!: ElementRef<HTMLInputElement>;

  constructor(
    private readonly apiService: ApiService,
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

    this.selectedImages = [];

    this.imagePreviews = [];

    for (const file of Array.from(input.files)) {

      const base64 = await this.convertToBase64(file);

      this.selectedImages.push({

        fileName: file.name,

        mimeType: file.type,

        base64

      });

      this.imagePreviews.push(base64);

    }

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

    this.isGenerating = true;

    const request: GenerateLayoutRequest = {

      title: '',

      objective: '',

      page_text: this.pageContent,

      images: this.selectedImages

    };

    this.apiService
      .generateLayouts(request)
      .subscribe({

        next: (response: GenerateLayoutResponse) => {

          console.log('AI Response', response);

          this.router.navigate([
            '/generating'
          ]);

        },

        error: (error) => {

          console.error(error);

          this.isGenerating = false;

          alert('Layout generation failed.');

        }

      });

  }
  
}