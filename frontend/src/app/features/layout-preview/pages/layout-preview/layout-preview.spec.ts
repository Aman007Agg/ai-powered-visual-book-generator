import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutPreview } from './layout-preview';

describe('LayoutPreview', () => {
  let component: LayoutPreview;
  let fixture: ComponentFixture<LayoutPreview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayoutPreview],
    }).compileComponents();

    fixture = TestBed.createComponent(LayoutPreview);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
