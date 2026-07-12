import { Component } from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-book-summary',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './book-summary.html',
  styleUrl: './book-summary.scss'
})
export class BookSummary {

  bookTitle = 'AI Handbook';

  totalPages = 8;

  layoutsSelected = 8;

}