import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookSummary } from './book-summary';

describe('BookSummary', () => {
  let component: BookSummary;
  let fixture: ComponentFixture<BookSummary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookSummary],
    }).compileComponents();

    fixture = TestBed.createComponent(BookSummary);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
