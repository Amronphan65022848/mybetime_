import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BetimeSolutionsComponent } from './betime-solutions.component';

describe('BetimeSolutionsComponent', () => {
  let component: BetimeSolutionsComponent;
  let fixture: ComponentFixture<BetimeSolutionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BetimeSolutionsComponent]
    });
    fixture = TestBed.createComponent(BetimeSolutionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
