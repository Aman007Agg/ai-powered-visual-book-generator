import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-layout-preview',
  standalone: true,
  imports: [
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatRadioModule,
    MatIconModule
  ],
  templateUrl: './layout-preview.html',
  styleUrl: './layout-preview.scss'
})
export class LayoutPreview {

  selectedLayout = 'A';

}