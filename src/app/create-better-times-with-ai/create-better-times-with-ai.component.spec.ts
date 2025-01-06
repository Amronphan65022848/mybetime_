import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBetterTimesWithAiComponent } from './create-better-times-with-ai.component';

describe('CreateBetterTimesWithAiComponent', () => {
  let component: CreateBetterTimesWithAiComponent;
  let fixture: ComponentFixture<CreateBetterTimesWithAiComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateBetterTimesWithAiComponent]
    });
    fixture = TestBed.createComponent(CreateBetterTimesWithAiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
