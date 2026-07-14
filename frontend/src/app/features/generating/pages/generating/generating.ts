import { Component , OnInit} from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';

import { Router } from '@angular/router';
import { LayoutStateService } from '../../../../core/services/state/layout-state.service';
import { GenerateLayoutResponse } from '../../../../shared/models/generate-layout-response.model';

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
  
  layoutResponse?: GenerateLayoutResponse;

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

    setTimeout(() => {
      this.router.navigate(['/layout-preview']);
    }, 2500);
  }
}