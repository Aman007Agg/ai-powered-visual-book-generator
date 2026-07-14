import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

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
    private readonly router: Router
  ) {}

  continue(): void {

    this.router.navigate(['/page-input']);

  }

}