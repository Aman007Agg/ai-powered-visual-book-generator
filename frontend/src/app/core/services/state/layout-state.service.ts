import { Injectable } from '@angular/core';

import { GenerateLayoutResponse } from '../../../shared/models/generate-layout-response.model';

@Injectable({
  providedIn: 'root'
})
export class LayoutStateService {

  private layoutResponse?: GenerateLayoutResponse;

  /**
   * Stores the latest AI generated layouts.
   */
  setLayoutResponse(
    response: GenerateLayoutResponse
  ): void {

    this.layoutResponse = response;

  }

  /**
   * Returns the stored AI response.
   */
  getLayoutResponse():
    GenerateLayoutResponse | undefined {

    return this.layoutResponse;

  }

  /**
   * Clears the stored response.
   */
  clear(): void {

    this.layoutResponse = undefined;

  }

}