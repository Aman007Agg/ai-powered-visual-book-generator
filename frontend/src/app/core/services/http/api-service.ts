import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import {
  Observable,
  throwError,
  catchError,
  retry
} from 'rxjs';

import { environment } from '../../../../environments/environment';

import { GenerateLayoutRequest } from '../../../shared/models/generate-layout-request.model';
import { GenerateLayoutResponse } from '../../../shared/models/generate-layout-response.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  /**
   * Angular HttpClient instance.
   */
  private readonly http = inject(HttpClient);

  /**
   * FastAPI endpoint for layout generation.
   */
  private readonly apiUrl =
    `${environment.apiBaseUrl}/layout/generate`;

  /**
   * Sends the current page content and uploaded images
   * to the FastAPI backend for AI-powered layout generation.
   */
  generateLayouts(
    request: GenerateLayoutRequest
  ): Observable<GenerateLayoutResponse> {

    return this.http
      .post<GenerateLayoutResponse>(
        this.apiUrl,
        request
      )
      .pipe(

        /**
         * Retry once for transient failures.
         */
        retry({
          count: 1,
          delay: 1000
        }),

        /**
         * Handle HTTP errors.
         */
        catchError((error) => {

          console.error(
            '[ApiService] Layout generation failed.',
            error
          );

          return throwError(() => error);

        })

      );
  }

}