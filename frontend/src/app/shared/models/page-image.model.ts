export interface PageImage {
  /**
   * Original uploaded filename.
   */
  fileName: string;

  /**
   * MIME type.
   * Example:
   * image/png
   * image/jpeg
   */
  mimeType: string;

  /**
   * Base64 encoded image.
   */
  base64: string;
}