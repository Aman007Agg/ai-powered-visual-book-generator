import { Component } from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';

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
export class Generating {

}