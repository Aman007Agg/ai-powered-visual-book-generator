import { LayoutSection } from './layout-section.model';

export interface LayoutOption {

  /**
   * Layout identifier.
   */
  id: string;

  /**
   * Layout name.
   */
  name: string;

  /**
   * All sections belonging to this layout.
   */
  sections: LayoutSection[];

}