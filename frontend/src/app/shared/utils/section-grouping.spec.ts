import { groupSections } from './section-grouping';
import { LayoutSection } from '../models/layout-section.model';

describe('groupSections', () => {

  it('returns empty groups for null or empty input', () => {
    expect(groupSections(null)).toEqual({ title: '', paragraphs: [], imageRefs: [] });
    expect(groupSections([])).toEqual({ title: '', paragraphs: [], imageRefs: [] });
  });

  it('groups sections by role, preserving order', () => {
    const sections: LayoutSection[] = [
      { type: 'title', text: 'T' },
      { type: 'paragraph', text: 'p1' },
      { type: 'image', image_reference: 0 },
      { type: 'paragraph', text: 'p2' },
      { type: 'image', image_reference: 1 },
    ];

    const grouped = groupSections(sections);

    expect(grouped.title).toBe('T');
    expect(grouped.paragraphs).toEqual(['p1', 'p2']);
    expect(grouped.imageRefs).toEqual([0, 1]);
  });

  it('keeps only the first title', () => {
    const grouped = groupSections([
      { type: 'title', text: 'A' },
      { type: 'title', text: 'B' },
    ]);
    expect(grouped.title).toBe('A');
  });

  it('includes image_reference 0 (not treated as falsy)', () => {
    const grouped = groupSections([{ type: 'image', image_reference: 0 }]);
    expect(grouped.imageRefs).toEqual([0]);
  });

  it('ignores empty text and missing image references', () => {
    const grouped = groupSections([
      { type: 'paragraph' },
      { type: 'image' },
    ]);
    expect(grouped.paragraphs).toEqual([]);
    expect(grouped.imageRefs).toEqual([]);
  });
});
