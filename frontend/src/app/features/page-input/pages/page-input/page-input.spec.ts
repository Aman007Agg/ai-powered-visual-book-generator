import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageInput } from './page-input';

describe('PageInput', () => {
  let component: PageInput;
  let fixture: ComponentFixture<PageInput>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageInput],
    }).compileComponents();

    fixture = TestBed.createComponent(PageInput);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
