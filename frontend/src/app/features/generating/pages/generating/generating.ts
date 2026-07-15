import { Component, OnInit } from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';

import { Router } from '@angular/router';
import { BookStateService } from '../../../../core/services/state/book-state.service';

@Component({
  selector: 'app-generating',
  standalone: true,
  imports: [
    MatCardModule,
    MatProgressBarModule,
    MatIconModule
  ],
  templateUrl: './generating.html',
  styleUrl: './generating.scss'
})
export class Generating implements OnInit {

  constructor(
    private readonly bookState: BookStateService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {

    // Guard: if we arrived here without a generated draft, go back.
    if (!this.bookState.draftResponse()) {
      this.router.navigate(['/page-input']);
      return;
    }

    // Brief "generating" beat, then reveal the layout options.
    setTimeout(() => {
      this.router.navigate(['/layout-preview']);
    }, 2500);
  }
}
