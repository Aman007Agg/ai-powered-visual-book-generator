import { Component, OnInit  } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';

import { Router } from '@angular/router';
import { LayoutStateService } from '../../../../core/services/state/layout-state.service';
import { GenerateLayoutResponse } from '../../../../shared/models/generate-layout-response.model';
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

  layoutResponse?: GenerateLayoutResponse;
  layoutOptions: LayoutOption[] = [];
  selectedLayoutId = '';

  /** Uploaded images passed to the renderer for image_reference resolution. */
  images: PageImage[] = [];

  constructor(
    private readonly layoutStateService: LayoutStateService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    const response = this.layoutStateService.getLayoutResponse();

    if (!response) {
      this.router.navigate(['/page-input']);
      return;
    }

    this.layoutResponse = response;
    this.layoutOptions = response.layout_options;
    this.images = this.layoutStateService.getPageImages();

    if (this.layoutOptions.length > 0) {
      this.selectedLayoutId = this.layoutOptions[0].id;
    }

  }

  continueWithSelectedLayout(): void {

    const selectedLayout = this.layoutOptions.find(
      layout => layout.id === this.selectedLayoutId
    );

    if (!selectedLayout) {

      alert('Please select a layout.');

      return;

    }

    console.log(
      'Selected Layout:',
      selectedLayout
    );

    this.router.navigate([
      '/book-summary'
    ]);

  }

}