import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Step2InputFormComponent } from './step2-input-form.component';

describe('Step2InputFormComponent', () => {
  let component: Step2InputFormComponent;
  let fixture: ComponentFixture<Step2InputFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Step2InputFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Step2InputFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
