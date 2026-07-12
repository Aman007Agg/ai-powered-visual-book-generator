import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Generating } from './generating';

describe('Generating', () => {
  let component: Generating;
  let fixture: ComponentFixture<Generating>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Generating],
    }).compileComponents();

    fixture = TestBed.createComponent(Generating);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
