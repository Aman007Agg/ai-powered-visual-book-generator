import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

import { BookStateService } from '../../../../core/services/state/book-state.service';

@Component({
  selector: 'app-new-book',
  standalone: true,
  imports: [
    FormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
  ],
  templateUrl: './new-book.html',
  styleUrl: './new-book.scss'
})
export class NewBook {

  title = '';

  objective = '';

  constructor(
    private readonly bookState: BookStateService,
    private readonly router: Router
  ) {}

  continue(): void {

    // Title & objective are optional; a fresh book resets any previous state.
    this.bookState.startNewBook(this.title, this.objective);

    this.router.navigate(['/page-input']);

  }

}