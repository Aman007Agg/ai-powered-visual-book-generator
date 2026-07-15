import { TestBed } from '@angular/core/testing';

import { BookStateService } from './book-state.service';
import { GenerateLayoutResponse } from '../../../shared/models/generate-layout-response.model';

function makeResponse(): GenerateLayoutResponse {
  return {
    page_summary: 'sum',
    layout_options: [
      { id: 'layout_1', layout_type: 'hero', layout_name: 'Hero', description: 'd', confidence: 95, sections: [] },
      { id: 'layout_2', layout_type: 'split', layout_name: 'Split', description: 'd', confidence: 90, sections: [] },
    ],
  };
}

describe('BookStateService', () => {

  let service: BookStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BookStateService);
  });

  it('starts a new book and resets state', () => {
    service.startNewBook('Title', 'Objective');
    expect(service.title()).toBe('Title');
    expect(service.objective()).toBe('Objective');
    expect(service.pageCount()).toBe(0);
  });

  it('commits a draft page with the selected layout and clears the draft', () => {
    service.startNewBook('T', 'O');
    service.startDraft('page text', [{ fileName: 'a', mimeType: 'image/png', base64: 'X' }]);
    service.setDraftResponse(makeResponse());

    service.commitCurrentPage('layout_2');

    expect(service.pageCount()).toBe(1);
    const page = service.pages()[0];
    expect(page.pageNumber).toBe(1);
    expect(page.pageText).toBe('page text');
    expect(page.selectedLayout.id).toBe('layout_2');
    expect(page.images.length).toBe(1);
    expect(service.draftResponse()).toBeUndefined();
  });

  it('ignores a commit with an unknown layout id', () => {
    service.startDraft('x', []);
    service.setDraftResponse(makeResponse());

    service.commitCurrentPage('does-not-exist');

    expect(service.pageCount()).toBe(0);
  });

  it('ignores a commit when there is no draft response', () => {
    service.startDraft('x', []);
    service.commitCurrentPage('layout_1');
    expect(service.pageCount()).toBe(0);
  });

  it('increments page numbers across commits', () => {
    service.startDraft('p1', []);
    service.setDraftResponse(makeResponse());
    service.commitCurrentPage('layout_1');

    service.startDraft('p2', []);
    service.setDraftResponse(makeResponse());
    service.commitCurrentPage('layout_1');

    expect(service.pageCount()).toBe(2);
    expect(service.pages()[1].pageNumber).toBe(2);
  });

  it('resetBook clears pages and metadata', () => {
    service.startNewBook('T', 'O');
    service.startDraft('p', []);
    service.setDraftResponse(makeResponse());
    service.commitCurrentPage('layout_1');

    service.resetBook();

    expect(service.pageCount()).toBe(0);
    expect(service.title()).toBe('');
    expect(service.objective()).toBe('');
  });
});
