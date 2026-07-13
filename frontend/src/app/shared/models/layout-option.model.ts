export interface LayoutOption {
  /**
   * Unique identifier for the layout.
   */
  id: string;

  /**
   * AI generated layout name.
   */
  layout_name: string;

  /**
   * Short explanation of why this layout was chosen.
   */
  description: string;

  /**
   * AI confidence score.
   */
  confidence: number;
}