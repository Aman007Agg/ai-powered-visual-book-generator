import { LayoutSection } from '../models/layout-section.model';

/**
 * A layout's sections regrouped by semantic role.
 *
 * The AI returns an ORDERED, flat list of sections (title / paragraph / image).
 * Each visual strategy (Hero, Split, Magazine) wants to arrange those roles
 * differently in space, so we first normalise the flat list into named groups.
 * This is what lets the SAME AI JSON render as three genuinely different
 * layouts without the components duplicating parsing logic.
 */
export interface GroupedSections {
  /** First title encountered (a page has at most one heading in the MVP). */
  title: string;

  /** All paragraph texts, in AI order. */
  paragraphs: string[];

  /** All image_reference indices, in AI order. */
  imageRefs: number[];
}

/**
 * Pure function: flat AI sections -> grouped-by-role structure.
 * Kept framework-free so it is trivially unit-testable.
 */
export function groupSections(
  sections: LayoutSection[] | null | undefined,
): GroupedSections {

  const grouped: GroupedSections = {
    title: '',
    paragraphs: [],
    imageRefs: [],
  };

  if (!sections) {
    return grouped;
  }

  for (const section of sections) {
    switch (section.type) {
      case 'title':
        if (!grouped.title && section.text) {
          grouped.title = section.text;
        }
        break;

      case 'paragraph':
        if (section.text) {
          grouped.paragraphs.push(section.text);
        }
        break;

      case 'image':
        if (section.image_reference != null) {
          grouped.imageRefs.push(section.image_reference);
        }
        break;
    }
  }

  return grouped;
}
