export type SectionType =
  | 'title'
  | 'paragraph'
  | 'image';

export interface LayoutSection {

  type: SectionType;

  text?: string;

  image_reference?: number;

}