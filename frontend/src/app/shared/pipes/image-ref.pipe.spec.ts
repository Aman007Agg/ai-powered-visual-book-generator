import { ImageRefPipe } from './image-ref.pipe';
import { PageImage } from '../models/page-image.model';

describe('ImageRefPipe', () => {

  const pipe = new ImageRefPipe();

  const images: PageImage[] = [
    { fileName: 'a', mimeType: 'image/png', base64: 'AAA' },
    { fileName: 'b', mimeType: 'image/png', base64: 'BBB' },
  ];

  it('resolves a valid index to its base64', () => {
    expect(pipe.transform(0, images)).toBe('AAA');
    expect(pipe.transform(1, images)).toBe('BBB');
  });

  it('returns empty string for an out-of-range index', () => {
    expect(pipe.transform(5, images)).toBe('');
  });

  it('returns empty string for null/undefined reference or images', () => {
    expect(pipe.transform(null, images)).toBe('');
    expect(pipe.transform(undefined, images)).toBe('');
    expect(pipe.transform(0, null)).toBe('');
    expect(pipe.transform(0, undefined)).toBe('');
  });
});
