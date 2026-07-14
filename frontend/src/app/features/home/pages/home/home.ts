import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [MatButtonModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})

export class Home {

  constructor(
    private readonly router: Router
  ) {}

  startNewBook(): void {
    this.router.navigate(['/new-book']);
  }

}
