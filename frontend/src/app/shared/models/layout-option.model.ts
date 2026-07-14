import { LayoutSection } from './layout-section.model';

export interface LayoutOption {

  id: string;

  layout_type: string;

  layout_name: string;

  description: string;

  confidence: number;

  sections: LayoutSection[];

}